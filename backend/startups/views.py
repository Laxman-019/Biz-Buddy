from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from startups.models import *
from startups.serializers import *


def startup_only(func):
    def wrapper(req,*args, **kwargs):
        if req.user.business_type == 'startup':
            return Response(
                {'error':'This feature is only available for startup accounts.'},status=403
            )
        return func(req,*args, **kwargs)
    
    wrapper.__name__ = func.__name__
    return wrapper


@api_view(['GET','POST'])
@permission_classes([IsAuthenticated])
@startup_only
def idea_list_create(req):
    if req.method == 'GET':
        ideas = IdeaValidation.objects.filter(user=req.user)
        serializer = IdeaValidationSerializer(ideas,many=True)

        return Response(serializer.data)
    
    serializer = IdeaValidationSerializer(data=req.data)
    if serializer.is_valid():
        serializer.save(user=req.user)
        return Response(serializer.data,status=201)
    
    return Response(serializer.errors,status=404)



@api_view(['GET','PUT','DELETE'])
@permission_classes([IsAuthenticated])
@startup_only
def idea_detail(req,idea_id):
    try:
        idea = IdeaValidation.objects.get(id=idea_id,user=req.user)

    except IdeaValidation.DoesNotExist:
        return Response({
            'error':'Idea not found.'
        },status=404)
    
    if req.method == 'GET':
        return Response(IdeaValidationSerializer(idea).data)
    
    if req.method == 'PUT':
        serializer = IdeaValidationSerializer(idea,data=req.data,partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        
        return Response(serializer.errors,status=400)
    
    idea.delete()
    return Response(status=204)


@api_view(['POST','PUT'])
@permission_classes([IsAuthenticated])
@startup_only
def scorecard(req,idea_id):
    try:
        idea = IdeaValidation.objects.get(id=idea_id,user=req.user)

    except IdeaValidation.DoesNotExist:
        return Response({
            'error':'Idea not found.'
        },status=404)
    
    instance = getattr(idea, 'scorecard', None)

    serializer = IdeaScorecardSerializer(instance, data=req.data, partial=True)

    if serializer.is_valid():
        serializer.save(idea=idea)
        return Response(serializer.data, status=200)
    return Response(serializer.errors, status=400)


@api_view(['POST', 'PUT'])
@permission_classes([IsAuthenticated])
@startup_only
def problem_validation(req, idea_id):
    try:
        idea = IdeaValidation.objects.get(id=idea_id, user=req.user)
    except IdeaValidation.DoesNotExist:
        return Response({'error': 'Idea not found.'}, status=404)

    instance = getattr(idea, 'problem_validation', None)

    serializer = ProblemValidationSerializer(instance, data=req.data, partial=True)
    if serializer.is_valid():
        serializer.save(idea=idea)
        return Response(serializer.data, status=200)
    return Response(serializer.errors, status=400)


@api_view(['POST', 'PUT'])
@permission_classes([IsAuthenticated])
@startup_only
def solution_fit(req, idea_id):
    try:
        idea = IdeaValidation.objects.get(id=idea_id, user=req.user)
    except IdeaValidation.DoesNotExist:
        return Response({'error': 'Idea not found.'}, status=404)

    instance = getattr(idea, 'solution_fit', None)

    serializer = SolutionFitSerializer(instance, data=req.data, partial=True)
    if serializer.is_valid():
        serializer.save(idea=idea)
        return Response(serializer.data, status=200)
    return Response(serializer.errors, status=400)