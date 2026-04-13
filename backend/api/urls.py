from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    health_check,
    HeroSlideViewSet, MassTimingViewSet, WelcomeMessageViewSet,
    AnnouncementViewSet, TimelineEventViewSet, TeamMemberViewSet,
    AboutPageViewSet, GalleryImageViewSet, BlogPostViewSet,
    ContactPageSettingsViewSet, ContactMessageViewSet,
    NoticeViewSet, PrayerRequestViewSet, SiteSettingsViewSet,
    GalleryCategoryViewSet
)



router = DefaultRouter()

# Home
router.register(r'hero-slides', HeroSlideViewSet)
router.register(r'mass-timings', MassTimingViewSet)
router.register(r'welcome-message', WelcomeMessageViewSet)
router.register(r'announcements', AnnouncementViewSet)

# About
router.register(r'timeline', TimelineEventViewSet)
router.register(r'team', TeamMemberViewSet)
router.register(r'about-page', AboutPageViewSet)

# Gallery
router.register(r'gallery-categories', GalleryCategoryViewSet)
router.register(r'gallery', GalleryImageViewSet)


# Blog
router.register(r'blog', BlogPostViewSet)

# Contact
router.register(r'contact-settings', ContactPageSettingsViewSet)
router.register(r'contact-messages', ContactMessageViewSet)

# Common
router.register(r'notices', NoticeViewSet)
router.register(r'prayer-requests', PrayerRequestViewSet)

router.register(r'site-settings', SiteSettingsViewSet)


urlpatterns = [

    path('', include(router.urls)),
    path('health/', health_check, name='health-check'),
]
