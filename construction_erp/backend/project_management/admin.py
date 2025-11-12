from django.contrib import admin
from .models import Project, Task, Milestone, ProjectDocument, ProjectTeam

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'status', 'start_date', 'end_date')
    list_filter = ('status', 'start_date')
    search_fields = ('name', 'description')

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('project', 'status', 'assigned_to', 'due_date')
    list_filter = ('status', 'due_date')
    search_fields = ('description',)

@admin.register(Milestone)
class MilestoneAdmin(admin.ModelAdmin):
    list_display = ('name', 'project')
    list_filter = ('project',)
    search_fields = ('name', 'description')

@admin.register(ProjectDocument)
class ProjectDocumentAdmin(admin.ModelAdmin):
    list_display = ('project', 'uploaded_at')
    list_filter = ('uploaded_at',)
    search_fields = ('description',)

@admin.register(ProjectTeam)
class ProjectTeamAdmin(admin.ModelAdmin):
    list_display = ('project', 'role')
    list_filter = ('role',)
    search_fields = ('project__name',)
