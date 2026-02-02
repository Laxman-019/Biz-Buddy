from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL

class BusinessRecord(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='business_records'
    )
    business_name = models.CharField(max_length=250)
    date = models.DateField()
    sales = models.FloatField()
    expenses = models.FloatField()
    profit = models.FloatField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self,*args, **kwargs):
        self.profit = self.sales - self.expenses

        super().save(*args, **kwargs)


    def __str__(self):
        return f"{self.business_name} - {self.date}"