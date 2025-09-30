from django.contrib import admin
from .models import Project, Task, Milestone, ProjectDocument, ProjectTeam

admin.site.register(Project)
admin.site.register(Task)
admin.site.register(Milestone)
admin.site.register(ProjectDocument)
admin.site.register(ProjectTeam)
