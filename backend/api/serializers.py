from rest_framework import serializers
from .models import (
    BlogPost, Notice, PrayerRequest, GalleryImage, HeroSlide,
    MassTiming, WelcomeMessage, Announcement, TimelineEvent,
    TeamMember, AboutPage, ContactInfo, ContactMessage, SiteSettings,
    GalleryCategory
)




class HeroSlideSerializer(serializers.ModelSerializer):
    image_url = serializers.ReadOnlyField(source='get_image_url')

    class Meta:
        model = HeroSlide
        fields = ['id', 'title', 'subtitle', 'button_text', 'button_link', 'image_url', 'order']


class MassTimingSerializer(serializers.ModelSerializer):
    class Meta:
        model = MassTiming
        fields = ['id', 'day', 'time', 'label', 'language']


class WelcomeMessageSerializer(serializers.ModelSerializer):
    priest_image_url = serializers.ReadOnlyField(source='get_priest_image_url')

    class Meta:
        model = WelcomeMessage
        fields = ['id', 'priest_name', 'priest_title', 'priest_image_url',
                  'heading', 'quote_text', 'body_text']


class AnnouncementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Announcement
        fields = ['id', 'title', 'description', 'date_text', 'tag']



class TimelineEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimelineEvent
        fields = ['id', 'year', 'title', 'description']


class TeamMemberSerializer(serializers.ModelSerializer):
    image_url = serializers.ReadOnlyField(source='get_image_url')
    avatar = serializers.ReadOnlyField()

    class Meta:
        model = TeamMember
        fields = ['id', 'name', 'role', 'image_url', 'avatar']


class AboutPageSerializer(serializers.ModelSerializer):
    hero_image_url = serializers.ReadOnlyField(source='get_hero_image_url')
    patron_image_url = serializers.ReadOnlyField(source='get_patron_image_url')

    class Meta:
        model = AboutPage
        fields = ['id', 'hero_image_url', 'patron_title',
                  'patron_description_1', 'patron_description_2', 'patron_image_url']


class GalleryCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = GalleryCategory
        fields = ['id', 'name', 'order']


class GalleryImageSerializer(serializers.ModelSerializer):
    image_url = serializers.ReadOnlyField(source='get_image_url')
    category_name = serializers.ReadOnlyField(source='category.name')

    class Meta:
        model = GalleryImage
        fields = ['id', 'title', 'image_url', 'category', 'category_name', 'created_at']



class BlogPostSerializer(serializers.ModelSerializer):
    image_url = serializers.ReadOnlyField(source='get_image_url')

    class Meta:
        model = BlogPost
        fields = ['id', 'title', 'slug', 'author', 'content', 'image_url',
                  'is_published', 'created_at']


class NoticeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notice
        fields = '__all__'


class PrayerRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrayerRequest
        fields = '__all__'


class ContactInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactInfo
        fields = ['id', 'address', 'phone', 'email', 'office_hours', 'google_maps_embed']



class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = '__all__'


class SiteSettingsSerializer(serializers.ModelSerializer):
    logo_url = serializers.SerializerMethodField()

    class Meta:
        model = SiteSettings
        fields = ['id', 'site_name', 'site_tagline', 'logo_url', 'favicon',
                  'facebook_url', 'instagram_url', 'youtube_url',
                  'footer_mission_statement', 'footer_copyright_text',
                  'footer_privacy_policy_url', 'footer_terms_url']

    def get_logo_url(self, obj):
        if obj.logo:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.logo.url)
            return obj.logo.url # Fallback if no request context
        return obj.logo_url


