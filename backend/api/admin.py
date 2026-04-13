from django.contrib import admin
from .models import (
    HeroSlide, MassTiming, WelcomeMessage, Announcement,
    TimelineEvent, TeamMember, AboutPage, GalleryImage,
    BlogPost, ContactInfo, ContactMessage, Notice, PrayerRequest, SiteSettings,
    GalleryCategory
)




# ═══════════════════════════════════════════════════════════════
# HOME PAGE
# ═══════════════════════════════════════════════════════════════

@admin.register(HeroSlide)
class HeroSlideAdmin(admin.ModelAdmin):
    list_display = ('title', 'subtitle', 'order', 'is_active', 'created_at')
    list_editable = ('order', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('title', 'subtitle')
    fieldsets = (
        ('Slide Content', {
            'fields': ('title', 'subtitle', 'button_text', 'button_link'),
        }),
        ('Image', {
            'fields': ('image', 'image_url'),
            'description': 'Upload an image OR paste an external URL.',
        }),
        ('Settings', {
            'fields': ('order', 'is_active'),
        }),
    )


@admin.register(MassTiming)
class MassTimingAdmin(admin.ModelAdmin):
    list_display = ('day', 'time', 'label', 'language', 'order', 'is_active')
    list_editable = ('order', 'is_active')
    list_filter = ('day', 'is_active')
    search_fields = ('day', 'label')


@admin.register(WelcomeMessage)
class WelcomeMessageAdmin(admin.ModelAdmin):
    list_display = ('priest_name', 'heading', 'is_active')
    fieldsets = (
        ('Priest Information', {
            'fields': ('priest_name', 'priest_title', 'priest_image', 'priest_image_url'),
        }),
        ('Message Content', {
            'fields': ('heading', 'quote_text', 'body_text'),
        }),
        ('Settings', {
            'fields': ('is_active',),
        }),
    )


@admin.register(Announcement)
class AnnouncementAdmin(admin.ModelAdmin):
    list_display = ('title', 'date_text', 'tag', 'is_active', 'created_at')
    list_editable = ('is_active',)
    list_filter = ('is_active', 'tag')
    search_fields = ('title',)


# ═══════════════════════════════════════════════════════════════
# ABOUT PAGE
# ═══════════════════════════════════════════════════════════════

@admin.register(TimelineEvent)
class TimelineEventAdmin(admin.ModelAdmin):
    list_display = ('year', 'title', 'order')
    list_editable = ('order',)
    search_fields = ('year', 'title')


@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    list_display = ('name', 'role', 'order', 'is_active')
    list_editable = ('order', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('name', 'role')
    fieldsets = (
        ('Member Info', {
            'fields': ('name', 'role'),
        }),
        ('Photo', {
            'fields': ('image', 'image_url'),
            'description': 'Upload a photo OR paste an external URL.',
        }),
        ('Settings', {
            'fields': ('order', 'is_active'),
        }),
    )


@admin.register(AboutPage)
class AboutPageAdmin(admin.ModelAdmin):
    list_display = ('__str__',)
    fieldsets = (
        ('Page Hero', {
            'fields': ('hero_image', 'hero_image_url'),
        }),
        ('Patron Saint Section', {
            'fields': ('patron_title', 'patron_description_1', 'patron_description_2',
                       'patron_image', 'patron_image_url'),
        }),
    )

    def has_add_permission(self, request):
        # Only allow one instance
        if self.model.objects.count() >= 1:
            return False
        return super().has_add_permission(request)


# ═══════════════════════════════════════════════════════════════
# GALLERY
# ═══════════════════════════════════════════════════════════════

@admin.register(GalleryCategory)
class GalleryCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'order')
    list_editable = ('order',)


@admin.register(GalleryImage)

class GalleryImageAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'created_at')
    list_filter = ('category',)
    search_fields = ('title', 'category')
    fieldsets = (
        ('Image Details', {
            'fields': ('title', 'category'),
        }),
        ('Image', {
            'fields': ('image', 'image_url'),
            'description': 'Upload an image OR paste an external URL.',
        }),
    )


# ═══════════════════════════════════════════════════════════════
# BLOG
# ═══════════════════════════════════════════════════════════════

@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'is_published', 'created_at')
    list_editable = ('is_published',)
    list_filter = ('is_published', 'author')
    search_fields = ('title', 'content')
    prepopulated_fields = {'slug': ('title',)}
    fieldsets = (
        ('Post Content', {
            'fields': ('title', 'slug', 'author', 'content'),
        }),
        ('Image', {
            'fields': ('image', 'image_url'),
            'description': 'Upload an image OR paste an external URL.',
        }),
        ('Settings', {
            'fields': ('is_published',),
        }),
    )


# ═══════════════════════════════════════════════════════════════
# CONTACT
# ═══════════════════════════════════════════════════════════════


@admin.register(ContactInfo)
class ContactInfoAdmin(admin.ModelAdmin):
    list_display = ('address', 'phone', 'email')
    save_on_top = True
    save_as_continue = True  # Enables "Save and continue editing"
    
    fieldsets = (
        ('Page Content', {
            'fields': ('page_title', 'header_image', 'header_image_url'),
        }),
        ('Contact Details', {
            'fields': ('address', 'phone', 'email', 'office_hours'),
        }),
        ('Google Maps', {
            'fields': ('google_maps_embed',),
        }),
    )
    
    # We unlock these to ensure ALL buttons (Save, Delete, Add another) appear exactly like your screenshot
    def has_add_permission(self, request):
        return True

    def has_change_permission(self, request, obj=None):
        return True

    def has_delete_permission(self, request, obj=None):
        return True

    def has_view_permission(self, request, obj=None):
        return True


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'subject', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('name', 'email', 'subject', 'message')
    readonly_fields = ('name', 'email', 'subject', 'message', 'created_at')

    def has_add_permission(self, request):
        return False


# ═══════════════════════════════════════════════════════════════
# COMMON
# ═══════════════════════════════════════════════════════════════

@admin.register(Notice)
class NoticeAdmin(admin.ModelAdmin):
    list_display = ('title', 'is_active', 'created_at')
    list_editable = ('is_active',)
    list_filter = ('is_active',)
    search_fields = ('title', 'content')


@admin.register(PrayerRequest)
class PrayerRequestAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'email', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('full_name', 'email')
    readonly_fields = ('full_name', 'email', 'phone', 'request', 'created_at')

    def has_add_permission(self, request):
        return False

@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    pass
