interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}

class EmailService {
  private fromAddress: string;

  constructor() {
    this.fromAddress = process.env.EMAIL_FROM || 'noreply@projecthub.com';
  }

  async send(options: EmailOptions): Promise<boolean> {
    try {
      // In production, use Resend, SendGrid, or similar
      console.log('Sending email:', {
        from: options.from || this.fromAddress,
        to: options.to,
        subject: options.subject,
      });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  }

  async sendTaskAssigned(to: string, data: { taskTitle: string; taskUrl: string; assignedBy: string }) {
    return this.send({
      to,
      subject: `📋 Task Assigned: ${data.taskTitle}`,
      html: `<h1>Task Assigned</h1><p>You have been assigned to <strong>${data.taskTitle}</strong> by ${data.assignedBy}.</p><a href="${data.taskUrl}">View Task</a>`,
    });
  }

  async sendCommentNotification(to: string, data: { taskTitle: string; commenter: string; taskUrl: string }) {
    return this.send({
      to,
      subject: `💬 New Comment on: ${data.taskTitle}`,
      html: `<h1>New Comment</h1><p>${data.commenter} commented on <strong>${data.taskTitle}</strong>.</p><a href="${data.taskUrl}">View Comment</a>`,
    });
  }

  async sendInvitation(to: string, data: { teamName: string; invitedBy: string; invitationUrl: string }) {
    return this.send({
      to,
      subject: `🤝 Invitation to join ${data.teamName}`,
      html: `<h1>Team Invitation</h1><p>${data.invitedBy} has invited you to join <strong>${data.teamName}</strong>.</p><a href="${data.invitationUrl}">Accept Invitation</a>`,
    });
  }

  async sendWeeklyDigest(to: string, data: { userName: string; completedTasks: number; newTasks: number }) {
    return this.send({
      to,
      subject: '📊 Your Weekly Project Digest',
      html: `<h1>Weekly Digest</h1><p>Hi ${data.userName},</p><p>This week: ${data.completedTasks} tasks completed, ${data.newTasks} new tasks.</p>`,
    });
  }

  async sendPasswordReset(to: string, resetUrl: string) {
    return this.send({
      to,
      subject: '🔐 Password Reset Request',
      html: `<h1>Password Reset</h1><p>Click the link below to reset your password:</p><a href="${resetUrl}">Reset Password</a>`,
    });
  }
}

export const emailService = new EmailService();