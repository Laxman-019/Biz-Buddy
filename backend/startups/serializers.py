from rest_framework import serializers
from startups.models import IdeaValidation


class IdeaValidationSerializer(serializers.ModelSerializer):
    dimension_scores = serializers.ReadOnlyField()

    class Meta:
        model  = IdeaValidation
        fields = [
            'id',
            'idea_title',
            'idea_description',
            'status',
            'overall_score',
            'verdict',
            'verdict_summary',
            'dimension_scores',
            'market_demand_analysis',
            'competition_analysis',
            'profit_analysis',
            'scalability_analysis',
            'entry_barriers_analysis',
            'founder_fit_analysis',
            'timing_analysis',
            'funding_analysis',
            'key_risks',
            'opportunities',
            'next_steps',
            'error_message',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'status', 'overall_score', 'verdict', 'verdict_summary',
            'dimension_scores',
            'market_demand_analysis', 'competition_analysis',
            'profit_analysis', 'scalability_analysis',
            'entry_barriers_analysis', 'founder_fit_analysis',
            'timing_analysis', 'funding_analysis',
            'key_risks', 'opportunities', 'next_steps',
            'error_message', 'created_at', 'updated_at',
        ]


class IdeaSubmitSerializer(serializers.Serializer):
    idea_title       = serializers.CharField(max_length=255)
    idea_description = serializers.CharField(min_length=50)

