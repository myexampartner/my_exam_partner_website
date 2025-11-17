"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  CardActions,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Divider,
  IconButton,
  Tooltip,
  Alert,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Skeleton,
  InputAdornment,
  Checkbox,
} from "@mui/material";
import {
      Campaign,
      Send,
      Preview,
      Edit,
      Add,
      Refresh,
      TrendingUp,
      People,
      Email,
      Schedule,
      CheckCircle,
      Cancel,
      Visibility,
      ContentCopy,
      Search,
    } from "@mui/icons-material";
import Swal from "sweetalert2";

const buildBulletList = (listString = "") =>
  listString
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => `<li>${item}</li>`)
    .join("");

const isValidHttpUrl = (value) => {
  if (!value || typeof value !== "string") return false;
  try {
    const url = new URL(value.trim());
    return ["http:", "https:"].includes(url.protocol);
  } catch (_err) {
    return false;
  }
};

const toSafeUrl = (value, fallback = "#") =>
  isValidHttpUrl(value) ? value.trim() : fallback;

function PromotionalEmailsManagement() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [previewDialog, setPreviewDialog] = useState(false);
  const [sendDialog, setSendDialog] = useState(false);
  const [emailData, setEmailData] = useState({
    subject: "",
    recipients: "all", // all, active, custom
    customEmails: "",
    scheduledDate: "",
    scheduledTime: "",
  });
  const [sending, setSending] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [dynamicFieldValues, setDynamicFieldValues] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  
  // Dynamic stats state
  const [dynamicStats, setDynamicStats] = useState({
    totalSubscribers: 0,
    activeSubscribers: 0,
    totalEmailsSent: 0,
    openRate: 0,
  });
  
  // Subscribe emails state
  const [subscribedEmails, setSubscribedEmails] = useState([]);
  const [emailsLoading, setEmailsLoading] = useState(true);
  const [emailSearchTerm, setEmailSearchTerm] = useState("");
  const [emailStatusFilter, setEmailStatusFilter] = useState("");
  const [emailDateFrom, setEmailDateFrom] = useState("");
  const [emailDateTo, setEmailDateTo] = useState("");
  const [emailPagination, setEmailPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });
  const [emailStats, setEmailStats] = useState({
    total: 0,
    active: 0,
    unsubscribed: 0,
  });
  
      // Email selection state
      const [selectedEmails, setSelectedEmails] = useState([]);
      
      // Email history dialog
      const [emailHistoryDialog, setEmailHistoryDialog] = useState(false);
      const [selectedEmailForHistory, setSelectedEmailForHistory] = useState(null);

  const getDefaultFieldValues = (template) => {
    if (!template?.dynamicFields?.length) return {};
    return template.dynamicFields.reduce((acc, field) => {
      acc[field.name] = field.defaultValue ?? "";
      return acc;
    }, {});
  };

  const getTemplateContent = (template, values) => {
    if (!template) return "";
    if (typeof template.renderContent === "function") {
      const fieldValues = values ?? getDefaultFieldValues(template);
      return template.renderContent(fieldValues);
    }
    return template.content || "";
  };

  const handleDynamicFieldChange = (fieldName, value) => {
    setDynamicFieldValues((prev) => ({ ...prev, [fieldName]: value }));
    setFieldErrors((prev) => ({ ...prev, [fieldName]: "" }));
  };

  const validateDynamicFields = (template, values) => {
    if (!template?.dynamicFields?.length) return true;

    const errors = {};

    template.dynamicFields.forEach((field) => {
      const rawValue = values[field.name];
      const value = typeof rawValue === "string" ? rawValue.trim() : rawValue;

      if (field.required && (!value && value !== 0)) {
        errors[field.name] = `${field.label} is required`;
        return;
      }

      if (field.type === "url" && value && !isValidHttpUrl(value)) {
        errors[field.name] = "Enter a valid URL";
        return;
      }

      if (field.type === "number" && value !== "" && value !== null) {
        const numericValue = Number(value);
        if (!Number.isFinite(numericValue)) {
          errors[field.name] = "Enter a valid number";
        }
      }
    });

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const renderDynamicFieldInput = (field) => {
    const value = dynamicFieldValues[field.name] ?? "";
    const errorMessage = fieldErrors[field.name] || "";

    const sharedProps = {
      fullWidth: true,
      label: field.label,
      value,
      onChange: (event) => handleDynamicFieldChange(field.name, event.target.value),
      error: Boolean(errorMessage),
      helperText: errorMessage || field.helperText || "",
      sx: {
        "& .MuiOutlinedInput-root": {
          borderRadius: 2,
        },
      },
    };

    switch (field.type) {
      case "textarea":
        return <TextField key={field.name} {...sharedProps} multiline rows={4} />;
      case "number":
        return <TextField key={field.name} {...sharedProps} type="number" />;
      case "url":
        return <TextField key={field.name} {...sharedProps} type="url" />;
      default:
        return <TextField key={field.name} {...sharedProps} />;
    }
  };

  const hasMissingRequiredDynamicFields = (template, values) => {
    if (!template?.dynamicFields?.length) return false;

    return template.dynamicFields.some((field) => {
      if (!field.required) return false;
      const rawValue = values[field.name];

      if (field.type === "number") {
        return rawValue === "" || rawValue === null || rawValue === undefined;
      }

      return !String(rawValue ?? "").trim();
    });
  };

  const closeSendDialog = () => {
    setSendDialog(false);
    setFieldErrors({});
    setDynamicFieldValues({});
  };

  // Email templates data
  const emailTemplates = [
    {
      id: 1,
      name: "Welcome Email",
      category: "Onboarding",
      subject: "Welcome to My Exam Partner!",
      preview: "Get started with your learning journey...",
      dynamicFields: [
        {
          name: "heroButtonUrl",
          label: "Get Started Button URL",
          type: "url",
          required: true,
          defaultValue: "https://myexampartner.com/get-started",
          helperText: "Paste the full link for the Get Started button",
        },
      ],
      renderContent: (values) => {
        const heroButtonUrl = toSafeUrl(values?.heroButtonUrl);

        return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1a1a2e; margin-bottom: 10px;">Welcome to My Exam Partner!</h1>
            <p style="color: #666; font-size: 16px;">Your journey to academic excellence starts here</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #1a1a2e; margin-top: 0;">What's Next?</h2>
            <ul style="color: #333; line-height: 1.6;">
              <li>Explore our comprehensive curriculum</li>
              <li>Book your first trial session</li>
              <li>Connect with expert tutors</li>
              <li>Track your progress</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${heroButtonUrl}" style="background: #1a1a2e; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Get Started</a>
          </div>
          
          <div style="border-top: 1px solid #e0e0e0; padding-top: 20px; text-align: center; color: #666; font-size: 14px;">
            <p>Thank you for choosing My Exam Partner!</p>
            <p>If you have any questions, feel free to contact us.</p>
          </div>
        </div>
      `;
      },
      lastUsed: "",
      usageCount: 0,
    },
    {
      id: 2,
      name: "Discount Offer",
      category: "Promotion",
      subject: "Special Discount - Limited Time Offer!",
      preview: "Get 20% off on all courses this month...",
      dynamicFields: [
        {
          name: "discountPercentage",
          label: "Discount Percentage",
          type: "number",
          required: true,
          defaultValue: "20",
          helperText: "Enter a numeric discount value (e.g. 20)",
        },
        {
          name: "ctaUrl",
          label: "Claim Your Discount Button URL",
          type: "url",
          required: true,
          defaultValue: "https://myexampartner.com/pricing",
          helperText: "Paste the link for the Claim Your Discount button",
        },
      ],
      renderContent: (values) => {
        const discountValue = Number(values?.discountPercentage);
        const discountDisplay = Number.isFinite(discountValue) ? `${discountValue}%` : "20%";
        const ctaUrl = toSafeUrl(values?.ctaUrl);

        return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1a1a2e; margin-bottom: 10px;">🎉 Special Discount Alert!</h1>
            <p style="color: #666; font-size: 16px;">Limited time offer - Don't miss out!</p>
          </div>
          
          <div style="background: linear-gradient(135deg, #ff6b6b, #ffa500); padding: 30px; border-radius: 8px; margin-bottom: 20px; text-align: center; color: white;">
            <h2 style="margin: 0; font-size: 36px;">${discountDisplay} OFF</h2>
            <p style="margin: 10px 0 0 0; font-size: 18px;">On All Courses</p>
            <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">Valid until end of this month</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #1a1a2e; margin-top: 0;">What You Get:</h3>
            <ul style="color: #333; line-height: 1.6;">
              <li>Access to all premium courses</li>
              <li>One-on-one tutoring sessions</li>
              <li>Progress tracking and analytics</li>
              <li>24/7 support</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${ctaUrl}" style="background: #ff6b6b; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Claim Your Discount</a>
          </div>
          
          <div style="background: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #ffc107; margin-bottom: 20px;">
            <p style="margin: 0; color: #856404; font-weight: bold;">⏰ Offer expires in 7 days!</p>
          </div>
          
          <div style="border-top: 1px solid #e0e0e0; padding-top: 20px; text-align: center; color: #666; font-size: 14px;">
            <p>Terms and conditions apply. Contact us for more details.</p>
          </div>
        </div>
      `;
      },
      lastUsed: "",
      usageCount: 0,
    },
    {
      id: 3,
      name: "Course Reminder",
      category: "Engagement",
      subject: "Don't forget your upcoming session!",
      preview: "Your tutoring session starts in 2 hours...",
      dynamicFields: [
        {
          name: "sessionSubject",
          label: "Subject",
          type: "text",
          required: true,
          defaultValue: "Mathematics",
        },
        {
          name: "tutorName",
          label: "Tutor Name",
          type: "text",
          required: true,
          defaultValue: "Sarah Johnson",
        },
        {
          name: "sessionTime",
          label: "Time",
          type: "text",
          required: true,
          defaultValue: "2:00 PM - 3:00 PM",
        },
        {
          name: "sessionDuration",
          label: "Duration",
          type: "text",
          required: true,
          defaultValue: "1 hour",
        },
        {
          name: "joinUrl",
          label: "Join Session URL",
          type: "url",
          required: true,
          defaultValue: "https://myexampartner.com/session",
        },
      ],
      renderContent: (values) => {
        const sessionSubject = values?.sessionSubject?.trim() || "Mathematics";
        const tutorName = values?.tutorName?.trim() || "Sarah Johnson";
        const sessionTime = values?.sessionTime?.trim() || "2:00 PM - 3:00 PM";
        const sessionDuration = values?.sessionDuration?.trim() || "1 hour";
        const joinUrl = toSafeUrl(values?.joinUrl);

        return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1a1a2e; margin-bottom: 10px;">📚 Session Reminder</h1>
            <p style="color: #666; font-size: 16px;">Your learning session is coming up!</p>
          </div>
          
          <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #2196f3;">
            <h3 style="color: #1a1a2e; margin-top: 0;">Session Details:</h3>
            <p style="margin: 5px 0; color: #333;"><strong>Subject:</strong> ${sessionSubject}</p>
            <p style="margin: 5px 0; color: #333;"><strong>Tutor:</strong> ${tutorName}</p>
            <p style="margin: 5px 0; color: #333;"><strong>Time:</strong> ${sessionTime}</p>
            <p style="margin: 5px 0; color: #333;"><strong>Duration:</strong> ${sessionDuration}</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #1a1a2e; margin-top: 0;">Preparation Tips:</h3>
            <ul style="color: #333; line-height: 1.6;">
              <li>Review your previous homework</li>
              <li>Prepare your questions</li>
              <li>Ensure stable internet connection</li>
              <li>Have your materials ready</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${joinUrl}" style="background: #2196f3; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Join Session</a>
          </div>
          
          <div style="background: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #ffc107; margin-bottom: 20px;">
            <p style="margin: 0; color: #856404;">💡 Need to reschedule? Contact us at least 2 hours before the session.</p>
          </div>
          
          <div style="border-top: 1px solid #e0e0e0; padding-top: 20px; text-align: center; color: #666; font-size: 14px;">
            <p>We're excited to see you in class!</p>
          </div>
        </div>
      `;
      },
      lastUsed: "",
      usageCount: 0,
    },
    {
      id: 4,
      name: "New Course Launch",
      category: "Announcement",
      subject: "New Course Available - Advanced Physics",
      preview: "We're excited to announce our new Advanced Physics course...",
      dynamicFields: [
        {
          name: "courseTitle",
          label: "Course Title",
          type: "text",
          required: true,
          defaultValue: "Advanced Physics",
        },
        {
          name: "courseSubtitle",
          label: "Course Subtitle",
          type: "text",
          required: true,
          defaultValue: "Master complex concepts with expert guidance",
        },
        {
          name: "courseHighlights",
          label: "Course Highlights (one per line)",
          type: "textarea",
          required: true,
          defaultValue: `Quantum Mechanics fundamentals\nThermodynamics and statistical mechanics\nElectromagnetic theory\nModern physics applications\nInteractive simulations and experiments`,
        },
        {
          name: "whatsIncluded",
          label: "What's Included (one per line)",
          type: "textarea",
          required: true,
          defaultValue: `50+ video lessons\nPractice problems and solutions\nLive Q&A sessions\nProgress tracking\nCertificate of completion`,
        },
        {
          name: "ctaUrl",
          label: "Enroll Now Button URL",
          type: "url",
          required: true,
          defaultValue: "https://myexampartner.com/courses/advanced-physics",
        },
      ],
      renderContent: (values) => {
        const courseTitle = values?.courseTitle?.trim() || "Advanced Physics";
        const courseSubtitle = values?.courseSubtitle?.trim() || "Master complex concepts with expert guidance";
        const highlightsHtml = buildBulletList(values?.courseHighlights);
        const includedHtml = buildBulletList(values?.whatsIncluded);
        const ctaUrl = toSafeUrl(values?.ctaUrl);

        return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1a1a2e; margin-bottom: 10px;">🚀 New Course Launch!</h1>
            <p style="color: #666; font-size: 16px;">${courseTitle} is now available</p>
          </div>
          
          <div style="background: linear-gradient(135deg, #667eea, #764ba2); padding: 30px; border-radius: 8px; margin-bottom: 20px; text-align: center; color: white;">
            <h2 style="margin: 0; font-size: 28px;">${courseTitle}</h2>
            <p style="margin: 10px 0 0 0; font-size: 16px;">${courseSubtitle}</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #1a1a2e; margin-top: 0;">Course Highlights:</h3>
            <ul style="color: #333; line-height: 1.6;">
              ${highlightsHtml}
            </ul>
          </div>
          
          <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #4caf50;">
            <h3 style="color: #1a1a2e; margin-top: 0;">What's Included:</h3>
            <ul style="color: #333; line-height: 1.6;">
              ${includedHtml}
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${ctaUrl}" style="background: #667eea; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Enroll Now</a>
          </div>
          
          <div style="background: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #ffc107; margin-bottom: 20px;">
            <p style="margin: 0; color: #856404; font-weight: bold;">🎁 Early bird discount: 15% off for first 100 students!</p>
          </div>
          
          <div style="border-top: 1px solid #e0e0e0; padding-top: 20px; text-align: center; color: #666; font-size: 14px;">
            <p>Ready to advance your physics knowledge? Join us today!</p>
          </div>
        </div>
      `;
      },
      lastUsed: "",
      usageCount: 0,
    },
  ];

  useEffect(() => {
    setTemplates(emailTemplates);
    setLoading(false);
    fetchSubscribedEmails();
  }, []);

  useEffect(() => {
    fetchSubscribedEmails();
  }, [emailPagination.currentPage, emailSearchTerm, emailStatusFilter, emailDateFrom, emailDateTo]);

  useEffect(() => {
    fetchDynamicStats();
  }, [templates]);

  const fetchDynamicStats = async () => {
    try {
      // Fetch subscriber stats
      const subscriberRes = await fetch('/api/subscribe-emails');
      const subscriberData = await subscriberRes.json();
      
      if (subscriberData.success) {
        setDynamicStats(prev => ({
          ...prev,
          totalSubscribers: subscriberData.stats.total,
          activeSubscribers: subscriberData.stats.active,
        }));
      }

      // Calculate real email stats from templates
      const totalEmailsSent = templates.reduce((sum, template) => sum + template.usageCount, 0);
      
      // Calculate open rate based on sent emails (mock calculation)
      const openRate = totalEmailsSent > 0 ? Math.min(25, Math.max(15, 20 + Math.random() * 10)).toFixed(1) : 0;
      
      setDynamicStats(prev => ({
        ...prev,
        totalEmailsSent,
        openRate: parseFloat(openRate),
      }));

    } catch (error) {
      console.error('Error fetching dynamic stats:', error);
    }
  };

  const fetchSubscribedEmails = async () => {
    try {
      setEmailsLoading(true);
      const params = new URLSearchParams({
        page: emailPagination.currentPage.toString(),
        limit: emailPagination.itemsPerPage.toString(),
        _t: Date.now().toString() // Add timestamp to force refresh
      });
      
      if (emailSearchTerm) params.append('search', emailSearchTerm);
      if (emailStatusFilter) params.append('status', emailStatusFilter);
      if (emailDateFrom) params.append('dateFrom', emailDateFrom);
      if (emailDateTo) params.append('dateTo', emailDateTo);
      
      const res = await fetch(`/api/subscribe-emails?${params}`);
      const data = await res.json();
      
      if (data.success) {
        setSubscribedEmails(data.data);
        setEmailPagination(data.pagination);
        setEmailStats(data.stats);
          } else {
            await Swal.fire({
              title: 'Error!',
              text: data.error || 'Failed to fetch subscribed emails',
              icon: 'error',
              confirmButtonText: 'OK',
              confirmButtonColor: '#d32f2f',
              showConfirmButton: true,
              allowOutsideClick: false,
              allowEscapeKey: false
            });
          }
    } catch (error) {
      await Swal.fire({
        title: 'Error!',
        text: 'Failed to fetch subscribed emails',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#d32f2f',
        showConfirmButton: true,
        allowOutsideClick: false,
        allowEscapeKey: false
      });
    } finally {
      setEmailsLoading(false);
    }
  };

  const handleEmailSearch = (value) => {
    setEmailSearchTerm(value);
    setEmailPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleEmailStatusFilter = (value) => {
    setEmailStatusFilter(value);
    setEmailPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleEmailDateFromChange = (value) => {
    setEmailDateFrom(value);
    setEmailPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleEmailDateToChange = (value) => {
    setEmailDateTo(value);
    setEmailPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleSelectEmail = (emailId) => {
    setSelectedEmails(prev => 
      prev.includes(emailId) 
        ? prev.filter(id => id !== emailId)
        : [...prev, emailId]
    );
  };

  const handleSelectAllEmails = () => {
    if (selectedEmails.length === subscribedEmails.length) {
      setSelectedEmails([]);
    } else {
      setSelectedEmails(subscribedEmails.map(email => email._id));
    }
  };

  const getEmailStatusColor = (status) => {
    return status === 'active' ? 'success' : 'default';
  };

  const getEmailStatusIcon = (status) => {
    return status === 'active' ? <CheckCircle /> : <Cancel />;
  };

  const formatEmailDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEmailSendStatus = (email) => {
    return email.emailSendStatus || 'not_sent';
  };

  const getSendStatusColor = (status) => {
    switch (status) {
      case 'sent': return 'success';
      case 'failed': return 'error';
      case 'sending': return 'warning';
      default: return 'default';
    }
  };

  const handleViewEmailHistory = (email) => {
    setSelectedEmailForHistory(email);
    setEmailHistoryDialog(true);
  };

  const handleAddEmailWithSweetAlert = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Add New Email',
      html: `
        <div style="text-align: left;">
          <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #1a1a2e;">Email Address</label>
            <input 
              id="swal-email" 
              type="email" 
              placeholder="Enter email address" 
              style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px; outline: none; transition: border-color 0.3s;"
              onfocus="this.style.borderColor='#1a1a2e'"
              onblur="this.style.borderColor='#e0e0e0'"
            />
            <div id="email-error" style="color: #d32f2f; font-size: 12px; margin-top: 5px; display: none;"></div>
          </div>
          
          <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #1a1a2e;">Source</label>
            <select 
              id="swal-source" 
              style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px; outline: none; background: white;"
            >
              <option value="manual_add">Manual Add</option>
              <option value="website_footer">Website Footer</option>
              <option value="contact_form">Contact Form</option>
              <option value="referral">Referral</option>
            </select>
          </div>
          
          <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #1a1a2e;">Status</label>
            <select 
              id="swal-status" 
              style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px; outline: none; background: white;"
            >
              <option value="active">Active</option>
              <option value="unsubscribed">Unsubscribed</option>
            </select>
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Add Email',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#4caf50',
      cancelButtonColor: '#d32f2f',
      width: '500px',
      customClass: {
        popup: 'swal-add-email-popup'
      },
      preConfirm: () => {
        const email = document.getElementById('swal-email').value;
        const source = document.getElementById('swal-source').value;
        const status = document.getElementById('swal-status').value;
        const emailError = document.getElementById('email-error');
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
          emailError.textContent = 'Email address is required';
          emailError.style.display = 'block';
          return false;
        } else if (!emailRegex.test(email)) {
          emailError.textContent = 'Please enter a valid email address';
          emailError.style.display = 'block';
          return false;
        } else {
          emailError.style.display = 'none';
        }
        
        return { email, source, status };
      }
    });

    if (formValues) {
      try {
        const response = await fetch('/api/subscribe-emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formValues),
        });

        const data = await response.json();

        if (data.success) {
          await Swal.fire({
            title: 'Email Added Successfully!',
            text: `Email ${formValues.email} has been added to the system.`,
            icon: 'success',
            confirmButtonText: 'Great!',
            confirmButtonColor: '#1a1a2e',
            timer: 3000,
            timerProgressBar: true,
          });
          
          fetchSubscribedEmails();
        } else {
          throw new Error(data.error || 'Failed to add email');
        }
      } catch (error) {
        await Swal.fire({
          title: 'Add Email Failed!',
          text: error.message || 'Failed to add email. Please try again.',
          icon: 'error',
          confirmButtonText: 'Try Again',
          confirmButtonColor: '#d32f2f',
        });
      }
    }
  };

  const handlePreview = (template) => {
    setSelectedTemplate(template);
    setPreviewDialog(true);
  };

  const handleSend = (template) => {
    if (!template) return;

    setSelectedTemplate(template);
    setDynamicFieldValues(getDefaultFieldValues(template));
    setFieldErrors({});
    setEmailData({
      subject: template.subject,
      recipients: "selected",
      customEmails: "",
      scheduledDate: "",
      scheduledTime: "",
    });
    setSendDialog(true);
  };

  const handleSendEmail = async () => {
    if (!selectedTemplate) return;

    // Check if emails are selected
    if (emailData.recipients === 'selected' && selectedEmails.length === 0) {
      await Swal.fire({
        title: 'No Emails Selected!',
        text: 'Please select at least one email to send to.',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#ff9800',
        showConfirmButton: true,
        allowOutsideClick: false,
        allowEscapeKey: false
      });
      return;
    }

    if (!validateDynamicFields(selectedTemplate, dynamicFieldValues)) {
      await Swal.fire({
        title: 'Missing Information',
        text: 'Please fix the highlighted fields before sending the email.',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#ff9800',
        showConfirmButton: true,
        allowOutsideClick: false,
        allowEscapeKey: false
      });
      return;
    }

    const finalContent = getTemplateContent(selectedTemplate, dynamicFieldValues);
    setSending(true);
    
    try {
      const response = await fetch('/api/promotional-emails/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateId: selectedTemplate.id,
          subject: emailData.subject,
          content: finalContent,
          dynamicFieldValues,
          recipients: emailData.recipients,
          customEmails: emailData.customEmails,
          selectedEmails: selectedEmails,
          scheduledDate: emailData.scheduledDate,
          scheduledTime: emailData.scheduledTime,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Close dialog first
        setSendDialog(false);
        setFieldErrors({});
        setDynamicFieldValues({});
        
        // Small delay to ensure dialog is closed
        setTimeout(async () => {
          // Show success message with SweetAlert2
          await Swal.fire({
            title: 'Email Sent Successfully!',
            text: `Email sent successfully to ${data.data.results.successful} recipients!`,
            icon: 'success',
            confirmButtonText: 'Great!',
            confirmButtonColor: '#1a1a2e',
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: true,
            allowOutsideClick: false,
            allowEscapeKey: false
          });
        }, 100);
        
        // Update template usage count
        setTemplates(prev => prev.map(t => 
          t.id === selectedTemplate.id 
            ? { ...t, usageCount: t.usageCount + 1, lastUsed: new Date().toISOString().split('T')[0] }
            : t
        ));
        
        // Update dynamic stats
        setDynamicStats(prev => ({
          ...prev,
          totalEmailsSent: prev.totalEmailsSent + 1,
        }));
        
        // Refresh subscribed emails to show updated status
        console.log('Refreshing subscribed emails after send...');
        
        // Add small delay to ensure database is updated
        setTimeout(async () => {
          await fetchSubscribedEmails();
        }, 1000);
        
        // Clear selected emails after successful send
        setSelectedEmails([]);
      } else {
        throw new Error(data.error || 'Failed to send email');
      }
      
    } catch (error) {
      console.error('Error sending email:', error);
      
      // Close dialog first
      setSendDialog(false);
      setFieldErrors({});
      setDynamicFieldValues({});
      
      // Small delay to ensure dialog is closed
      setTimeout(async () => {
        // Show error message with SweetAlert2
        await Swal.fire({
          title: 'Email Send Failed!',
          text: error.message || 'Failed to send email. Please try again.',
          icon: 'error',
          confirmButtonText: 'Try Again',
          confirmButtonColor: '#d32f2f',
          showConfirmButton: true,
          allowOutsideClick: false,
          allowEscapeKey: false
        });
      }, 100);
      
    } finally {
      setSending(false);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Onboarding': '#4caf50',
      'Promotion': '#ff9800',
      'Engagement': '#2196f3',
      'Announcement': '#9c27b0',
    };
    return colors[category] || '#666';
  };

  const getRecipientCount = (recipients) => {
    const counts = {
      'selected': selectedEmails.length.toString(),
      'custom': emailData.customEmails.split(',').filter(email => email.trim()).length,
    };
    return counts[recipients] || '0';
  };


  return (
    <>
      {/* Custom SweetAlert2 Styles */}
      <style jsx global>{`
        .swal-add-email-popup {
          z-index: 9999 !important;
        }
        .swal2-container {
          z-index: 9999 !important;
        }
        .swal2-popup {
          z-index: 9999 !important;
        }
      `}</style>
      <style jsx global>{`
        .swal2-popup-custom {
          border-radius: 16px !important;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
          border: 1px solid rgba(0,0,0,0.08) !important;
          backdrop-filter: blur(10px) !important;
        }
        
        .swal2-title-custom {
          font-size: 1.5rem !important;
          font-weight: 700 !important;
          color: #1a1a2e !important;
          margin-bottom: 0.5rem !important;
        }
        
        .swal2-content-custom {
          font-size: 1rem !important;
          color: #666666 !important;
          line-height: 1.5 !important;
        }
        
        .swal2-confirm {
          border-radius: 8px !important;
          font-weight: 600 !important;
          padding: 12px 24px !important;
          font-size: 1rem !important;
          text-transform: none !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
          transition: all 0.3s ease !important;
        }
        
        .swal2-confirm:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2) !important;
        }
      `}</style>

      <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
            mb={3}
          >
            <Box>
              <Typography 
                variant="h4" 
                fontWeight="700" 
                sx={{ 
                  color: '#1a1a2e',
                  letterSpacing: '-0.5px',
                  mb: 0.5
                }}
              >
                Promotional Emails
              </Typography>
              <Typography 
                color="text.secondary" 
                variant="body2"
                sx={{ fontWeight: 400 }}
              >
                Create and send promotional emails to your subscribers
              </Typography>
            </Box>
          </Stack>

          {/* Stats Cards */}
          <Grid container spacing={3} mb={3}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
                <Campaign sx={{ fontSize: 40, color: '#1a1a2e', mb: 1 }} />
                <Typography variant="h4" fontWeight="bold" color="#1a1a2e">
                  {templates.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Email Templates
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
                <Send sx={{ fontSize: 40, color: '#4caf50', mb: 1 }} />
                <Typography variant="h4" fontWeight="bold" color="#4caf50">
                  {dynamicStats.totalEmailsSent}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Emails Sent
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
                <People sx={{ fontSize: 40, color: '#2196f3', mb: 1 }} />
                <Typography variant="h4" fontWeight="bold" color="#2196f3">
                  {dynamicStats.totalSubscribers}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Subscribers
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
                <TrendingUp sx={{ fontSize: 40, color: '#ff9800', mb: 1 }} />
                <Typography variant="h4" fontWeight="bold" color="#ff9800">
                  {dynamicStats.openRate}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Open Rate
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* Email Templates Grid */}
        <Grid container spacing={3}>
          {templates.map((template) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={template.id}>
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                borderRadius: 2,
                border: '1px solid #e0e0e0',
                boxShadow: 'none',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                  transform: 'translateY(-2px)'
                }
              }}>
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Typography variant="h6" fontWeight="600" sx={{ color: '#1a1a2e' }}>
                      {template.name}
                    </Typography>
                    <Chip
                      label={template.category}
                      size="small"
                      sx={{
                        backgroundColor: getCategoryColor(template.category),
                        color: 'white',
                        fontWeight: 500,
                        fontSize: '0.75rem'
                      }}
                    />
                  </Stack>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.5 }}>
                    {template.preview}
                  </Typography>
                  
                  <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                      <Email sx={{ fontSize: 16, mr: 0.5 }} />
                      <Typography variant="caption">
                        {template.usageCount} sent
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                      <Schedule sx={{ fontSize: 16, mr: 0.5 }} />
                      <Typography variant="caption">
                        {template.lastUsed || 'Never'}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
                
                <CardActions sx={{ p: 3, pt: 0 }}>
                  <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
                    <Button
                      variant="outlined"
                      startIcon={<Visibility />}
                      onClick={() => handlePreview(template)}
                      sx={{
                        flex: 1,
                        textTransform: 'none',
                        borderColor: '#1a1a2e',
                        color: '#1a1a2e',
                        '&:hover': {
                          borderColor: '#2d2d44',
                          backgroundColor: '#f5f5f5'
                        }
                      }}
                    >
                      Preview
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<Send />}
                      onClick={() => handleSend(template)}
                      sx={{
                        flex: 1,
                        textTransform: 'none',
                        background: '#1a1a2e',
                        '&:hover': {
                          background: '#2d2d44'
                        }
                      }}
                    >
                      Send
                    </Button>
                  </Stack>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Subscribed Emails Table */}
        <Box sx={{ mt: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography 
              variant="h5" 
              fontWeight="600" 
              sx={{ 
                color: '#1a1a2e',
              }}
            >
              Subscribed Emails ({selectedEmails.length} selected)
            </Typography>
            
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddEmailWithSweetAlert}
              sx={{
                textTransform: 'none',
                background: '#4caf50',
                '&:hover': { background: '#45a049' },
                borderRadius: 2,
                px: 3,
                py: 1
              }}
            >
              Add Email
            </Button>
          </Box>

          {/* Email Filters */}
          <Grid container spacing={2} mb={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                placeholder="Search by email..."
                value={emailSearchTerm}
                onChange={(e) => handleEmailSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={emailStatusFilter}
                  label="Status"
                  onChange={(e) => handleEmailStatusFilter(e.target.value)}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="unsubscribed">Unsubscribed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <TextField
                fullWidth
                type="date"
                label="Email Sent From Date"
                value={emailDateFrom}
                onChange={(e) => handleEmailDateFromChange(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <TextField
                fullWidth
                type="date"
                label="Email Sent To Date"
                value={emailDateTo}
                onChange={(e) => handleEmailDateToChange(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Refresh />}
                onClick={fetchSubscribedEmails}
                disabled={emailsLoading}
                sx={{
                  height: '56px',
                  textTransform: 'none',
                  borderColor: '#1a1a2e',
                  color: '#1a1a2e',
                  '&:hover': {
                    borderColor: '#2d2d44',
                    backgroundColor: '#f5f5f5'
                  }
                }}
              >
                Refresh
              </Button>
            </Grid>
          </Grid>

          {/* Email Table */}
          <Paper sx={{ 
            borderRadius: 2, 
            border: '1px solid #e0e0e0',
            boxShadow: 'none', 
            overflow: 'hidden',
            backgroundColor: 'white'
          }}>
            {emailsLoading ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#fafafa', borderBottom: '2px solid #e0e0e0' }}>
                      <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#424242' }}>Select</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#424242' }}>Email</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#424242' }}>Last Email Sent</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#424242' }}>Source</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#424242' }}>History</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {[1, 2, 3, 4, 5].map((item) => (
                      <TableRow key={item}>
                        <TableCell>
                          <Skeleton variant="circular" width={24} height={24} />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" width={200} height={20} />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="rounded" width={80} height={24} />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" width={120} height={20} />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" width={100} height={20} />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="rounded" width={80} height={24} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#fafafa', borderBottom: '2px solid #e0e0e0' }}>
                      <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#424242' }}>
                        <Checkbox
                          checked={selectedEmails.length === subscribedEmails.length && subscribedEmails.length > 0}
                          indeterminate={selectedEmails.length > 0 && selectedEmails.length < subscribedEmails.length}
                          onChange={handleSelectAllEmails}
                        />
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#424242' }}>Email</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#424242' }}>Last Email Sent</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#424242' }}>Source</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#424242' }}>History</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {subscribedEmails.map((email) => (
                      <TableRow
                        key={email._id}
                        sx={{
                          '&:hover': { backgroundColor: '#fafafa' },
                          transition: 'background-color 0.15s ease',
                          borderBottom: '1px solid #f0f0f0',
                          backgroundColor: selectedEmails.includes(email._id) ? '#e3f2fd' : 'transparent'
                        }}
                      >
                        <TableCell>
                          <Checkbox
                            checked={selectedEmails.includes(email._id)}
                            onChange={() => handleSelectEmail(email._id)}
                          />
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar sx={{ 
                              backgroundColor: "#1a1a2e",
                              width: 40,
                              height: 40
                            }}>
                              <Email />
                            </Avatar>
                            <Box>
                              <Typography fontWeight={600} variant="body2">{email.email}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                ID: {email._id.slice(-8)}
                              </Typography>
                            </Box>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {email.lastEmailSentAt ? formatEmailDate(email.lastEmailSentAt) : 'Never'}
                          </Typography>
                          {email.emailSendCount > 0 && (
                            <Typography variant="caption" color="text.secondary">
                              {email.emailSendCount} emails sent
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={email.source.replace('_', ' ').toUpperCase()}
                            size="small"
                            variant="outlined"
                            sx={{ textTransform: 'capitalize' }}
                          />
                        </TableCell>
                        <TableCell>
                          <Tooltip title="View Email History">
                            <IconButton 
                              size="small" 
                              onClick={() => handleViewEmailHistory(email)}
                              sx={{ color: '#1a1a2e' }}
                            >
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>

          {/* Email Pagination */}
          {!emailsLoading && emailPagination.totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Showing {((emailPagination.currentPage - 1) * emailPagination.itemsPerPage) + 1} to {Math.min(emailPagination.currentPage * emailPagination.itemsPerPage, emailPagination.totalItems)} of {emailPagination.totalItems} entries
              </Typography>
              
              <Stack direction="row" spacing={1} alignItems="center">
                <Button
                  disabled={emailPagination.currentPage === 1}
                  onClick={() => setEmailPagination(prev => ({ ...prev, currentPage: 1 }))}
                  variant="outlined"
                  size="small"
                  sx={{ minWidth: 'auto', px: 1 }}
                >
                  First
                </Button>
                <Button
                  disabled={emailPagination.currentPage === 1}
                  onClick={() => setEmailPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                  variant="outlined"
                  size="small"
                  sx={{ minWidth: 'auto', px: 1 }}
                >
                  Previous
                </Button>
                
                {/* Page Numbers */}
                <Stack direction="row" spacing={0.5}>
                  {(() => {
                    const pages = [];
                    const totalPages = emailPagination.totalPages;
                    const currentPage = emailPagination.currentPage;
                    
                    // Show first page
                    if (currentPage > 3) {
                      pages.push(
                        <Button
                          key={1}
                          onClick={() => setEmailPagination(prev => ({ ...prev, currentPage: 1 }))}
                          variant={currentPage === 1 ? "contained" : "outlined"}
                          size="small"
                          sx={{ minWidth: 'auto', px: 1.5 }}
                        >
                          1
                        </Button>
                      );
                      if (currentPage > 4) {
                        pages.push(
                          <Typography key="ellipsis1" sx={{ px: 1, display: 'flex', alignItems: 'center' }}>
                            ...
                          </Typography>
                        );
                      }
                    }
                    
                    // Show pages around current page
                    const start = Math.max(1, currentPage - 2);
                    const end = Math.min(totalPages, currentPage + 2);
                    
                    for (let i = start; i <= end; i++) {
                      pages.push(
                        <Button
                          key={i}
                          onClick={() => setEmailPagination(prev => ({ ...prev, currentPage: i }))}
                          variant={currentPage === i ? "contained" : "outlined"}
                          size="small"
                          sx={{ minWidth: 'auto', px: 1.5 }}
                        >
                          {i}
                        </Button>
                      );
                    }
                    
                    // Show last page
                    if (currentPage < totalPages - 2) {
                      if (currentPage < totalPages - 3) {
                        pages.push(
                          <Typography key="ellipsis2" sx={{ px: 1, display: 'flex', alignItems: 'center' }}>
                            ...
                          </Typography>
                        );
                      }
                      pages.push(
                        <Button
                          key={totalPages}
                          onClick={() => setEmailPagination(prev => ({ ...prev, currentPage: totalPages }))}
                          variant={currentPage === totalPages ? "contained" : "outlined"}
                          size="small"
                          sx={{ minWidth: 'auto', px: 1.5 }}
                        >
                          {totalPages}
                        </Button>
                      );
                    }
                    
                    return pages;
                  })()}
                </Stack>
                
                <Button
                  disabled={emailPagination.currentPage === emailPagination.totalPages}
                  onClick={() => setEmailPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                  variant="outlined"
                  size="small"
                  sx={{ minWidth: 'auto', px: 1 }}
                >
                  Next
                </Button>
                <Button
                  disabled={emailPagination.currentPage === emailPagination.totalPages}
                  onClick={() => setEmailPagination(prev => ({ ...prev, currentPage: emailPagination.totalPages }))}
                  variant="outlined"
                  size="small"
                  sx={{ minWidth: 'auto', px: 1 }}
                >
                  Last
                </Button>
              </Stack>
            </Box>
          )}
        </Box>

        {/* Preview Dialog */}
        <Dialog open={previewDialog} onClose={() => setPreviewDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle sx={{ 
            background: 'white', 
            color: '#1a1a2e',
            borderBottom: '1px solid #e0e0e0',
            pb: 2.5, 
            pt: 3,
            px: 3
          }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h5" fontWeight="600" sx={{ letterSpacing: '-0.3px' }}>
                Email Preview
              </Typography>
              <IconButton onClick={() => setPreviewDialog(false)}>
                <Cancel />
              </IconButton>
            </Stack>
          </DialogTitle>
          <DialogContent sx={{ p: 0 }}>
            {selectedTemplate && (
              <Box sx={{ p: 3 }}>
                <Box sx={{ mb: 3, p: 2, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Subject Line:
                  </Typography>
                  <Typography variant="h6" fontWeight="600" sx={{ color: '#1a1a2e' }}>
                    {selectedTemplate.subject}
                  </Typography>
                </Box>
                
                <Box sx={{ 
                  border: '1px solid #e0e0e0', 
                  borderRadius: 2, 
                  overflow: 'hidden',
                  backgroundColor: 'white'
                }}>
                  <div dangerouslySetInnerHTML={{ __html: getTemplateContent(selectedTemplate) }} />
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2.5, background: '#fafafa', borderTop: '1px solid #e0e0e0' }}>
            <Button 
              onClick={() => setPreviewDialog(false)}
              sx={{ 
                textTransform: 'none',
                color: '#616161',
                '&:hover': { backgroundColor: '#f5f5f5' }
              }}
            >
              Close
            </Button>
            <Button 
              variant="contained"
              startIcon={<Send />}
              onClick={() => {
                setPreviewDialog(false);
                handleSend(selectedTemplate);
              }}
              sx={{
                textTransform: 'none',
                background: '#1a1a2e',
                '&:hover': { background: '#2d2d44' }
              }}
            >
              Send Email
            </Button>
          </DialogActions>
        </Dialog>

        {/* Send Dialog */}
        <Dialog open={sendDialog} onClose={closeSendDialog} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ 
            background: 'white', 
            color: '#1a1a2e',
            borderBottom: '1px solid #e0e0e0',
            pb: 2.5, 
            pt: 3,
            px: 3
          }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h5" fontWeight="600" sx={{ letterSpacing: '-0.3px' }}>
                Send Email
              </Typography>
              <IconButton onClick={closeSendDialog}>
                <Cancel />
              </IconButton>
            </Stack>
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Subject Line"
                value={emailData.subject}
                onChange={(e) => setEmailData(prev => ({ ...prev, subject: e.target.value }))}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
              
              <FormControl fullWidth>
                <InputLabel>Recipients</InputLabel>
                <Select
                  value={emailData.recipients}
                  label="Recipients"
                  onChange={(e) => setEmailData(prev => ({ ...prev, recipients: e.target.value }))}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="selected">Selected Emails ({selectedEmails.length})</MenuItem>
                  <MenuItem value="custom">Custom List</MenuItem>
                </Select>
              </FormControl>
              
              {emailData.recipients === 'custom' && (
                <TextField
                  fullWidth
                  label="Email Addresses"
                  placeholder="Enter email addresses separated by commas"
                  value={emailData.customEmails}
                  onChange={(e) => setEmailData(prev => ({ ...prev, customEmails: e.target.value }))}
                  multiline
                  rows={3}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
              )}
              
              {selectedTemplate?.dynamicFields?.length > 0 && (
                <Stack spacing={2}>
                  {selectedTemplate.dynamicFields.map((field) => renderDynamicFieldInput(field))}
                </Stack>
              )}

              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  type="date"
                  label="Schedule Date"
                  value={emailData.scheduledDate}
                  onChange={(e) => setEmailData(prev => ({ ...prev, scheduledDate: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
                <TextField
                  fullWidth
                  type="time"
                  label="Schedule Time"
                  value={emailData.scheduledTime}
                  onChange={(e) => setEmailData(prev => ({ ...prev, scheduledTime: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
              </Box>
              
              <Alert severity="info" sx={{ borderRadius: 2 }}>
                <Typography variant="body2">
                  This email will be sent to <strong>{getRecipientCount(emailData.recipients)}</strong> recipients.
                  {emailData.scheduledDate && emailData.scheduledTime && (
                    <span> Scheduled for {new Date(`${emailData.scheduledDate}T${emailData.scheduledTime}`).toLocaleString()}.</span>
                  )}
                </Typography>
              </Alert>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2.5, background: '#fafafa', borderTop: '1px solid #e0e0e0' }}>
            <Button 
              onClick={closeSendDialog}
              disabled={sending}
              sx={{ 
                textTransform: 'none',
                color: '#616161',
                '&:hover': { backgroundColor: '#f5f5f5' }
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="contained"
              startIcon={sending ? <CircularProgress size={20} color="inherit" /> : <Send />}
              onClick={handleSendEmail}
              disabled={
                sending ||
                !emailData.subject ||
                (emailData.recipients === 'selected' && selectedEmails.length === 0) ||
                hasMissingRequiredDynamicFields(selectedTemplate, dynamicFieldValues)
              }
              sx={{
                textTransform: 'none',
                background: '#1a1a2e',
                '&:hover': { background: '#2d2d44' },
                '&:disabled': { background: '#ccc' }
              }}
            >
              {sending ? 'Sending...' : 'Send Email'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Email History Dialog */}
        <Dialog open={emailHistoryDialog} onClose={() => setEmailHistoryDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle sx={{ 
            background: 'white', 
            color: '#1a1a2e',
            borderBottom: '1px solid #e0e0e0',
            fontWeight: 600
          }}>
            Email History - {selectedEmailForHistory?.email}
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            {selectedEmailForHistory?.emailSendHistory?.length > 0 ? (
              <Stack spacing={2}>
                {selectedEmailForHistory.emailSendHistory.map((history, index) => (
                  <Card key={index} sx={{ p: 2, border: '1px solid #e0e0e0' }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="h6" fontWeight={600}>
                          {history.templateName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Subject: {history.subject}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Sent: {formatEmailDate(history.sentAt)}
                        </Typography>
                      </Box>
                      <Chip
                        icon={history.status === 'sent' ? <CheckCircle /> : <Cancel />}
                        label={history.status.toUpperCase()}
                        color={history.status === 'sent' ? 'success' : 'error'}
                        size="small"
                      />
                    </Stack>
                  </Card>
                ))}
              </Stack>
            ) : (
              <Typography variant="body1" color="text.secondary" textAlign="center" py={4}>
                No email history found for this subscriber.
              </Typography>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button 
              onClick={() => setEmailHistoryDialog(false)}
              variant="outlined"
              sx={{
                textTransform: 'none',
                borderColor: '#1a1a2e',
                color: '#1a1a2e',
                '&:hover': {
                  borderColor: '#2d2d44',
                  backgroundColor: '#f5f5f5'
                }
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
}

export default PromotionalEmailsManagement;
