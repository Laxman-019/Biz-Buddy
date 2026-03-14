from rest_framework import serializers
from startups.models import IdeaValidation, IdeaScorecard, ProblemValidation, SolutionFit

class IdeaScorecardSerializer(serializers.ModelSerializer):

    score_label = serializers.ReadOnlyField()

    class Meta:
        model = IdeaScorecard
        fields = [
            'id','market_demand','competition_level','profit_potential',
            'scalability', 'entry_barriers', 'founder_fit',
            'timing_factor', 'funding_readiness',
            'total_score', 'score_label', 'notes',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['total_score', 'created_at', 'updated_at']


class ProblemValidationSerializer(serializers.ModelSerializer):
    class Meta:
        model  = ProblemValidation
        fields = [
            'id',
            'problem_frequency', 'problem_severity',
            'current_solutions', 'willingness_to_pay',
            'willingness_details', 'monthly_search_volume',
            'notes', 'created_at', 'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at']


class SolutionFitSerializer(serializers.ModelSerializer):
    class Meta:
        model = SolutionFit
        fields = [
            'id',
            'core_features', 'delight_factors',
            'min_price', 'max_price',
            'purchase_trigger', 'common_objections',
            'landing_page_url', 'waitlist_signups',
            'notes', 'created_at', 'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at']


class IdeaValidationSerializer(serializers.ModelSerializer):
    scorecard = IdeaScorecardSerializer(read_only=True)
    problem_validation = ProblemValidationSerializer(read_only=True)
    solution_fit = SolutionFitSerializer(read_only=True)
    overall_score = serializers.ReadOnlyField()

    class Meta:
        model = IdeaValidation
        fields = [
            'id','idea_title','description','status',
            'overall_score','scorecard','problem_validation',
            'solution_fit','created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']