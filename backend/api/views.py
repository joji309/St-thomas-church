from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import (
    BlogPost, Notice, PrayerRequest, GalleryImage, HeroSlide,
    MassTiming, WelcomeMessage, Announcement, TimelineEvent,
    TeamMember, AboutPage, ContactPageSettings, ContactMessage, SiteSettings,
    GalleryCategory, BibleVerse
)


from .serializers import (
    BlogPostSerializer, NoticeSerializer, PrayerRequestSerializer,
    GalleryImageSerializer, HeroSlideSerializer, MassTimingSerializer,
    WelcomeMessageSerializer, AnnouncementSerializer, TimelineEventSerializer,
    TeamMemberSerializer, AboutPageSerializer, ContactPageSettingsSerializer,
    ContactMessageSerializer, SiteSettingsSerializer,
    GalleryCategorySerializer, BibleVerseSerializer
)




# ─── HOME PAGE ────────────────────────────────────────────────

class HeroSlideViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = HeroSlide.objects.filter(is_active=True)
    serializer_class = HeroSlideSerializer
    permission_classes = [permissions.AllowAny]


class MassTimingViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = MassTiming.objects.filter(is_active=True)
    serializer_class = MassTimingSerializer
    permission_classes = [permissions.AllowAny]


class WelcomeMessageViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = WelcomeMessage.objects.filter(is_active=True)
    serializer_class = WelcomeMessageSerializer
    permission_classes = [permissions.AllowAny]


class AnnouncementViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Announcement.objects.filter(is_active=True)
    serializer_class = AnnouncementSerializer
    permission_classes = [permissions.AllowAny]


# ─── ABOUT PAGE ───────────────────────────────────────────────

class TimelineEventViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = TimelineEvent.objects.all()
    serializer_class = TimelineEventSerializer
    permission_classes = [permissions.AllowAny]


class TeamMemberViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = TeamMember.objects.filter(is_active=True)
    serializer_class = TeamMemberSerializer
    permission_classes = [permissions.AllowAny]


class AboutPageViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AboutPage.objects.all()
    serializer_class = AboutPageSerializer
    permission_classes = [permissions.AllowAny]


# ─── GALLERY ──────────────────────────────────────────────────

class GalleryCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = GalleryCategory.objects.all()
    serializer_class = GalleryCategorySerializer
    permission_classes = [permissions.AllowAny]


class GalleryImageViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = GalleryImage.objects.all()
    serializer_class = GalleryImageSerializer
    permission_classes = [permissions.AllowAny]



# ─── BLOG ─────────────────────────────────────────────────────

class BlogPostViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = BlogPost.objects.filter(is_published=True)
    serializer_class = BlogPostSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'



# ─── CONTACT ──────────────────────────────────────────────────

class ContactPageSettingsViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ContactPageSettings.objects.all()
    serializer_class = ContactPageSettingsSerializer
    permission_classes = [permissions.AllowAny]


class ContactMessageViewSet(viewsets.ModelViewSet):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    authentication_classes = [] # Fix CSRF for public submission


    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]


class SiteSettingsViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SiteSettings.objects.all()
    serializer_class = SiteSettingsSerializer
    permission_classes = [permissions.AllowAny]


class BibleVerseViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = BibleVerse.objects.filter(is_active=True)
    serializer_class = BibleVerseSerializer
    permission_classes = [permissions.AllowAny]


# ─── COMMON ──────────────────────────────────────────────────


class NoticeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Notice.objects.filter(is_active=True)
    serializer_class = NoticeSerializer
    permission_classes = [permissions.AllowAny]


class PrayerRequestViewSet(viewsets.ModelViewSet):
    queryset = PrayerRequest.objects.all()
    serializer_class = PrayerRequestSerializer
    authentication_classes = [] # Fix CSRF for public submission


    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]


@api_view(['GET'])
def health_check(request):
    return Response({'status': 'ok'}, status=status.HTTP_200_OK)
