from rest_framework import serializers
from startups.models import *


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
    idea_title = serializers.CharField(max_length=255)
    idea_description = serializers.CharField(min_length=50)
    

class MarketIntelligenceSerializer(serializers.ModelSerializer):
    class Meta:
        model  = MarketIntelligence
        fields = [
            'id',
            'product_name', 'industry', 'target_region',
            'customer_type', 'description', 'status',
            'market_summary', 'key_insights',
            'tam_value', 'tam_explanation',
            'sam_value', 'sam_explanation',
            'som_value', 'som_explanation',
            'sizing_methodology',
            'market_growth_rate', 'market_direction', 'trend_summary',
            'tailwinds', 'headwinds', 'tech_shifts',
            'regulatory_factors', 'consumer_shifts',
            'personas',
            'error_message',
            'created_at', 'updated_at',
        ]
        read_only_fields = [
            'status', 'market_summary', 'key_insights',
            'tam_value', 'tam_explanation',
            'sam_value', 'sam_explanation',
            'som_value', 'som_explanation',
            'sizing_methodology',
            'market_growth_rate', 'market_direction', 'trend_summary',
            'tailwinds', 'headwinds', 'tech_shifts',
            'regulatory_factors', 'consumer_shifts',
            'personas', 'error_message',
            'created_at', 'updated_at',
        ]


class MarketSubmitSerializer(serializers.Serializer):
    product_name  = serializers.CharField(max_length=255)
    industry = serializers.CharField(max_length=100)
    target_region = serializers.ChoiceField(choices=[
        'india', 'global', 'north_india', 'south_india',
        'east_india', 'west_india', 'tier1_cities', 'tier2_cities',
        'southeast_asia', 'us', 'europe',
    ])
    customer_type = serializers.ChoiceField(choices=['b2b', 'b2c', 'both'])
    description   = serializers.CharField(min_length=30)
    


class BusinessModelSerializer(serializers.ModelSerializer):
    idea_title = serializers.CharField(source='idea.idea_title', read_only=True)

    class Meta:
        model  = BusinessModel
        fields = [
            'id', 'idea', 'idea_title',
            'revenue_model', 'price_per_customer',
            'estimated_cac', 'additional_context', 'status',
            'overall_summary', 'business_model_score', 'overall_verdict',
            'canvas_problem', 'canvas_solution', 'canvas_uvp',
            'canvas_unfair_advantage', 'canvas_customer_segments',
            'canvas_channels', 'canvas_revenue_streams',
            'canvas_cost_structure', 'canvas_key_metrics',
            'revenue_model_analysis', 'revenue_model_recommended',
            'revenue_model_reasoning', 'pricing_recommendation',
            'ltv_estimate', 'ltv_explanation', 'cac_analysis',
            'ltv_cac_ratio', 'ltv_cac_verdict',
            'payback_period_months', 'payback_verdict',
            'contribution_margin', 'unit_economics_score',
            'recommendations', 'risks',
            'error_message', 'created_at', 'updated_at',
        ]
        read_only_fields = [
            'status', 'overall_summary', 'business_model_score',
            'overall_verdict',
            'canvas_problem', 'canvas_solution', 'canvas_uvp',
            'canvas_unfair_advantage', 'canvas_customer_segments',
            'canvas_channels', 'canvas_revenue_streams',
            'canvas_cost_structure', 'canvas_key_metrics',
            'revenue_model_analysis', 'revenue_model_recommended',
            'revenue_model_reasoning', 'pricing_recommendation',
            'ltv_estimate', 'ltv_explanation', 'cac_analysis',
            'ltv_cac_ratio', 'ltv_cac_verdict',
            'payback_period_months', 'payback_verdict',
            'contribution_margin', 'unit_economics_score',
            'recommendations', 'risks',
            'error_message', 'created_at', 'updated_at',
        ]


class BusinessModelSubmitSerializer(serializers.Serializer):
    idea_id = serializers.IntegerField()
    revenue_model = serializers.ChoiceField(choices=[
        'subscription', 'one_time', 'freemium',
        'marketplace', 'advertising', 'usage_based',
        'licensing', 'not_decided',
    ])
    price_per_customer = serializers.DecimalField(max_digits=10, decimal_places=2)
    estimated_cac = serializers.DecimalField(max_digits=10, decimal_places=2)
    additional_context = serializers.CharField(required=False, allow_blank=True)