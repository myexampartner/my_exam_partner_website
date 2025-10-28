import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import SubscribeEmail from '@/models/SubscribeEmail';
import { sendEmail } from '@/lib/nodemailer';

export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { 
      templateId, 
      subject, 
      content, 
      recipients, 
      customEmails, 
      selectedEmails,
      scheduledDate, 
      scheduledTime 
    } = body;

    if (!subject || !content) {
      return NextResponse.json(
        { success: false, error: 'Subject and content are required' },
        { status: 400 }
      );
    }

    let recipientEmails = [];

    // Get recipient emails based on selection
    switch (recipients) {
      case 'selected':
        if (!selectedEmails || selectedEmails.length === 0) {
          return NextResponse.json(
            { success: false, error: 'No emails selected' },
            { status: 400 }
          );
        }
        const selectedEmailDocs = await SubscribeEmail.find({ _id: { $in: selectedEmails } }).select('email');
        recipientEmails = selectedEmailDocs.map(item => item.email);
        break;
      
      case 'custom':
        if (!customEmails) {
          return NextResponse.json(
            { success: false, error: 'Custom emails are required when selecting custom recipients' },
            { status: 400 }
          );
        }
        recipientEmails = customEmails.split(',').map(email => email.trim()).filter(email => email);
        break;
      
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid recipient selection' },
          { status: 400 }
        );
    }

    if (recipientEmails.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No recipients found' },
        { status: 400 }
      );
    }

    // Create email campaign record
    const emailCampaign = {
      templateId,
      subject,
      content,
      recipients: recipientEmails,
      recipientCount: recipientEmails.length,
      status: 'pending',
      createdAt: new Date(),
      scheduledAt: scheduledDate && scheduledTime ? new Date(`${scheduledDate}T${scheduledTime}`) : new Date(),
    };

    // In a real application, you would:
    // 1. Save the campaign to a database
    // 2. Queue the emails for sending
    // 3. Use an email service like SendGrid, Mailgun, or AWS SES
    // 4. Handle scheduling if scheduledDate/scheduledTime is provided

    // For now, we'll simulate the email sending process
    // Real email sending function using nodemailer
    const sendEmailToRecipient = async (email, subject, content) => {
      try {
        const result = await sendEmail(email, subject, content);
        return result;
      } catch (error) {
        console.error(`Error sending email to ${email}:`, error);
        return { success: false, email, error: error.message };
      }
    };

    // Send emails and update database
    const results = [];
    const currentTime = new Date();
    
    // Helper function to get template name
    function getTemplateName(templateId) {
      const templates = {
        1: 'Welcome Email',
        2: 'Discount Offer', 
        3: 'Course Reminder',
        4: 'New Course Launch'
      };
      return templates[templateId] || 'Unknown Template';
    }
    
    for (const email of recipientEmails) {
      try {
        const result = await sendEmailToRecipient(email, subject, content);
        
        // Update email send tracking in database
        console.log(`Updating database for email: ${email}, result:`, result);
        const updateResult = await SubscribeEmail.findOneAndUpdate(
          { email: email },
          {
            $set: { 
              lastEmailSentAt: currentTime,
              emailSendStatus: result.success ? 'sent' : 'failed'
            },
            $inc: { emailSendCount: 1 },
            $push: {
              emailSendHistory: {
                templateId: templateId.toString(),
                templateName: getTemplateName(templateId),
                subject: subject,
                sentAt: currentTime,
                status: result.success ? 'sent' : 'failed'
              }
            }
          },
          { new: true }
        );
        console.log(`Database update result for ${email}:`, updateResult?.emailSendStatus);
        
        results.push(result);
      } catch (error) {
        // Update failed status in database
        console.log(`Updating failed status for email: ${email}`);
        const failedUpdateResult = await SubscribeEmail.findOneAndUpdate(
          { email: email },
          {
            $set: { 
              emailSendStatus: 'failed',
              lastEmailSentAt: currentTime
            },
            $push: {
              emailSendHistory: {
                templateId: templateId.toString(),
                templateName: getTemplateName(templateId),
                subject: subject,
                sentAt: currentTime,
                status: 'failed'
              }
            }
          },
          { new: true }
        );
        console.log(`Failed update result for ${email}:`, failedUpdateResult?.emailSendStatus);
        
        results.push({ success: false, email, error: error.message });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;

    return NextResponse.json({
      success: true,
      message: `Email campaign sent successfully`,
      data: {
        campaign: emailCampaign,
        results: {
          total: recipientEmails.length,
          successful: successCount,
          failed: failureCount,
          details: results,
        },
      },
    });

  } catch (error) {
    console.error('Error sending promotional email:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send promotional email' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;

    // In a real application, you would fetch campaigns from a database
    // For now, we'll return mock data
    const mockCampaigns = [
      {
        id: 1,
        templateId: 1,
        subject: "Welcome to My Exam Partner!",
        recipientCount: 150,
        status: 'sent',
        sentAt: new Date('2024-01-15T10:30:00'),
        openRate: 23.5,
        clickRate: 5.2,
      },
      {
        id: 2,
        templateId: 2,
        subject: "Special Discount - Limited Time Offer!",
        recipientCount: 1200,
        status: 'sent',
        sentAt: new Date('2024-01-10T14:00:00'),
        openRate: 18.7,
        clickRate: 8.1,
      },
      {
        id: 3,
        templateId: 3,
        subject: "Don't forget your upcoming session!",
        recipientCount: 89,
        status: 'scheduled',
        scheduledAt: new Date('2024-01-20T09:00:00'),
        openRate: null,
        clickRate: null,
      },
    ];

    const totalItems = mockCampaigns.length;
    const skip = (page - 1) * limit;
    const campaigns = mockCampaigns.slice(skip, skip + limit);

    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
      totalItems,
      itemsPerPage: limit,
    };

    return NextResponse.json({
      success: true,
      data: campaigns,
      pagination,
    });

  } catch (error) {
    console.error('Error fetching promotional email campaigns:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch campaigns' },
      { status: 500 }
    );
  }
}
