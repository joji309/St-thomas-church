from django.db import models


# ─────────────────────────────────────────────────────────────
# HOME PAGE
# ─────────────────────────────────────────────────────────────

class HeroSlide(models.Model):
    title = models.CharField(max_length=200)
    subtitle = models.CharField(max_length=300, blank=True)
    button_text = models.CharField(max_length=50, default='Learn More')
    button_link = models.CharField(max_length=200, default='/about')
    image = models.ImageField(upload_to='hero/', blank=True, null=True)
    image_url = models.URLField(max_length=500, blank=True, null=True, help_text="External image URL (fallback)")
    order = models.PositiveIntegerField(default=0, help_text="Lower numbers appear first")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', '-created_at']
        verbose_name = 'Hero Slide'
        verbose_name_plural = 'Hero Slides'


    def __str__(self):
        return self.title

    @property
    def get_image_url(self):
        if self.image:
            return self.image.url
        return self.image_url


class MassTiming(models.Model):
    day = models.CharField(max_length=50, help_text="e.g. Monday – Friday, Sunday")
    time = models.CharField(max_length=20, help_text="e.g. 6:30 AM")
    label = models.CharField(max_length=100, help_text="e.g. Daily Mass, Vigil Mass")
    language = models.CharField(max_length=50, default='English', help_text="e.g. English / Konkani")
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['order']
        verbose_name = 'Mass Timing'
        verbose_name_plural = 'Mass Timings'


    def __str__(self):
        return f"{self.day} - {self.time} ({self.label})"


class WelcomeMessage(models.Model):
    priest_name = models.CharField(max_length=100, default='Fr. John D\'Souza')
    priest_title = models.CharField(max_length=100, default='Parish Priest')
    priest_image = models.ImageField(upload_to='priest/', blank=True, null=True)
    priest_image_url = models.URLField(max_length=500, blank=True, null=True)
    heading = models.CharField(max_length=200, default='A Warm Welcome')
    quote_text = models.TextField(help_text="The main highlighted quote")
    body_text = models.TextField(help_text="Additional paragraph text below the quote")
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = 'Welcome Message'
        verbose_name_plural = 'Welcome Message'


    def __str__(self):
        return f"Welcome Message by {self.priest_name}"

    @property
    def get_priest_image_url(self):
        if self.priest_image:
            return self.priest_image.url
        return self.priest_image_url


class Announcement(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    date_text = models.CharField(max_length=50, help_text="Display date e.g. 'March 28'")
    tag = models.CharField(max_length=50, help_text="e.g. Liturgy, Youth, Event")

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Announcement'
        verbose_name_plural = 'Announcements'


    def __str__(self):
        return self.title


# ─────────────────────────────────────────────────────────────
# ABOUT PAGE
# ─────────────────────────────────────────────────────────────

class TimelineEvent(models.Model):
    year = models.CharField(max_length=20, help_text="e.g. 1581, Today")
    title = models.CharField(max_length=200)
    description = models.TextField()
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']
        verbose_name = 'Timeline Event'
        verbose_name_plural = 'Timeline Events'


    def __str__(self):
        return f"{self.year} - {self.title}"


class TeamMember(models.Model):
    name = models.CharField(max_length=100)
    role = models.CharField(max_length=100)
    image = models.ImageField(upload_to='team/', blank=True, null=True)
    image_url = models.URLField(max_length=500, blank=True, null=True)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['order']
        verbose_name = 'Team Member'
        verbose_name_plural = 'Team Members'


    def __str__(self):
        return f"{self.name} - {self.role}"

    @property
    def get_image_url(self):
        if self.image:
            return self.image.url
        return self.image_url

    @property
    def avatar(self):
        return ''.join([part[0].upper() for part in self.name.split()[:2]])


class AboutPage(models.Model):
    """Singleton-like model for About page text content"""
    hero_image = models.ImageField(upload_to='about/', blank=True, null=True)
    hero_image_url = models.URLField(max_length=500, blank=True, null=True)
    patron_title = models.CharField(max_length=200, default='St. Thomas, The Apostle')
    patron_description_1 = models.TextField(blank=True)
    patron_description_2 = models.TextField(blank=True)
    patron_image = models.ImageField(upload_to='about/', blank=True, null=True)
    patron_image_url = models.URLField(max_length=500, blank=True, null=True)

    class Meta:
        verbose_name = 'About Page Content'
        verbose_name_plural = 'About Page Content'


    def __str__(self):
        return "About Page Content"

    @property
    def get_hero_image_url(self):
        if self.hero_image:
            return self.hero_image.url
        return self.hero_image_url

    @property
    def get_patron_image_url(self):
        if self.patron_image:
            return self.patron_image.url
        return self.patron_image_url


# ─────────────────────────────────────────────────────────────
# GALLERY PAGE
# ─────────────────────────────────────────────────────────────

class GalleryCategory(models.Model):
    name = models.CharField(max_length=50, unique=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'name']
        verbose_name = 'Gallery Category'
        verbose_name_plural = 'Gallery Categories'


    def __str__(self):
        return self.name


class GalleryImage(models.Model):
    title = models.CharField(max_length=200)
    image = models.ImageField(upload_to='gallery/', blank=True, null=True)
    image_url = models.URLField(max_length=500, blank=True, null=True, help_text="External image URL (fallback)")
    category = models.ForeignKey(GalleryCategory, on_delete=models.SET_NULL, null=True, related_name='images')
    created_at = models.DateTimeField(auto_now_add=True)



    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Gallery Image'
        verbose_name_plural = 'Gallery Images'


    def __str__(self):
        return self.title

    @property
    def get_image_url(self):
        if self.image:
            return self.image.url
        return self.image_url


# ─────────────────────────────────────────────────────────────
# BLOG PAGE
# ─────────────────────────────────────────────────────────────

class BlogPost(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    author = models.CharField(max_length=100, default='St. Thomas Church Admin')
    content = models.TextField()
    image = models.ImageField(upload_to='blog/', blank=True, null=True)
    image_url = models.URLField(max_length=500, blank=True, null=True)
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Blog Post'
        verbose_name_plural = 'Blog Posts'


    def __str__(self):
        return self.title

    @property
    def get_image_url(self):
        if self.image:
            return self.image.url
        return self.image_url


# ─────────────────────────────────────────────────────────────
# CONTACT PAGE
# ─────────────────────────────────────────────────────────────

class ContactPageSettings(models.Model):
    """
    Brand new model for managing the Contact Us page and Footer info.
    Using a new table name to ensure a 100% fresh start.
    """
    # Header Section
    header_title = models.CharField(max_length=150, default='Contact Us')
    header_background_image = models.ImageField(upload_to='contact_page/', blank=True, null=True)
    header_image_external_url = models.URLField(max_length=500, blank=True, null=True, help_text="Paste a link if not uploading an image")

    # The Core Details
    physical_address = models.TextField(default='Tivim, Bardez, Goa - 403502')
    contact_phone_number = models.CharField(max_length=100, default='+91 832 226 xxxx')
    contact_email_address = models.EmailField(default='stthomas.tivim@example.com')
    office_operating_hours = models.CharField(max_length=150, default='Mon–Sat, 9 AM – 5 PM')
    
    # The Map
    google_maps_iframe_code = models.TextField(blank=True, help_text="Paste the Share -> Embed code from Google Maps here")

    class Meta:
        verbose_name = 'Contact Page Configuration'
        verbose_name_plural = 'Contact Page Configuration'

    def __str__(self):
        return self.header_title

    @property
    def final_header_image(self):
        if self.header_background_image:
            return self.header_background_image.url
        return self.header_image_external_url or "/images/contact-bg.jpg"


class ContactMessage(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.CharField(max_length=200, blank=True)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Contact Message'
        verbose_name_plural = 'Contact Messages'


    def __str__(self):
        return f"Message from {self.name} - {self.subject or 'No Subject'}"


# ─────────────────────────────────────────────────────────────
# BIBLE VERSES
# ─────────────────────────────────────────────────────────────

class BibleVerse(models.Model):
    verse_text = models.TextField(help_text="The scripture text")
    reference = models.CharField(max_length=100, help_text="e.g. John 3:16")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Daily Bible Verse'
        verbose_name_plural = 'Daily Bible Verses'

    def __str__(self):
        return self.reference


# ─────────────────────────────────────────────────────────────
# COMMON
# ─────────────────────────────────────────────────────────────

class Notice(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Notice'
        verbose_name_plural = 'Notices'


    def __str__(self):
        return self.title


class PrayerRequest(models.Model):
    full_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=15, blank=True, null=True)
    request = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Prayer Request'
        verbose_name_plural = 'Prayer Requests'


    def __str__(self):
        return f"Request from {self.full_name}"


# ─────────────────────────────────────────────────────────────
# SETTINGS
# ─────────────────────────────────────────────────────────────

class SiteSettings(models.Model):
    """Singleton model for site-wide settings"""
    site_name = models.CharField(max_length=100, default='St. Thomas Church')
    site_tagline = models.CharField(max_length=100, default='Tivim, Goa')
    logo = models.ImageField(upload_to='site/', blank=True, null=True)
    logo_url = models.URLField(max_length=500, blank=True, null=True, help_text="External logo URL (fallback)")
    favicon = models.ImageField(upload_to='site/', blank=True, null=True)
    
    # Social Media
    facebook_url = models.URLField(blank=True, null=True)
    instagram_url = models.URLField(blank=True, null=True)
    youtube_url = models.URLField(blank=True, null=True)

    # Footer Content
    footer_mission_statement = models.TextField(
        default='Serving the faithful of Tivim, Goa. A beacon of faith, hope, and community in the heart of our village.',
        help_text="The short description that appears under the logo in the footer"
    )
    footer_copyright_text = models.CharField(
        max_length=200, 
        default='St. Thomas Church, Tivim, Goa. All rights reserved.',
        help_text="Custom copyright text (e.g. Church Name, Address)"
    )
    footer_privacy_policy_url = models.CharField(max_length=200, default='#')
    footer_terms_url = models.CharField(max_length=200, default='#')

    class Meta:
        verbose_name = 'Site Settings'
        verbose_name_plural = 'Site Settings'


    def __str__(self):
        return "Site Settings"

    @property
    def get_logo_url(self):
        if self.logo:
            return self.logo.url
        return self.logo_url

