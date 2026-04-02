export type Language = 'en' | 'ru' | 'uz';

export const translations = {
  en: {
    nav: {
      home: "Home",
      signUp: "Sign Up",
      platform: "Platform",
      solutions: "Solutions",
      pricing: "Pricing",
      resources: "Resources",
      login: "Log in",
      contact: "Contact",
      getStarted: "Get Started"
    },
    ticket: {
      tag: "Support",
      title: "Log a",
      titleAccent: "Ticket",
      subtitle: "Need assistance? Our support team is here to help you with any technical or account-related issues.",
      steps: {
        category: "Category",
        details: "Details",
        priority: "Priority",
        review: "Review"
      },
      fields: {
        type: "Issue Type",
        subject: "Subject",
        description: "Description",
        urgency: "Urgency",
        impact: "Impact"
      },
      placeholders: {
        subject: "Briefly describe the issue",
        description: "Provide as much detail as possible..."
      },
      submit: "Submit Ticket",
      success: "Ticket Submitted Successfully",
      successDesc: "Our team will review your request and get back to you shortly."
    },
    hero: {
      title: "Find the Best",
      titleAccent: "IT Talent Globally",
      subtitle: "Connect with verified engineers from 94+ countries. Build your dream team in days, not months.",
      ctaPrimary: "Start Hiring",
      ctaSecondary: "Watch Demo"
    },
    trusted: "Trusted by industry leaders",
    stats: {
      tag: "By The Numbers",
      title: "Powering",
      titleAccent: "enterprise scale",
      subtitle: "Join the world's fastest-growing companies that trust Desknet to fulfill their IT talent needs",
      verified: "Verified Engineers",
      verifiedSub: "Pre-vetted Engineers Ready to Work",
      partners: "Partner Companies",
      partnersSub: "Trusted Partner Companies",
      matchTime: "avg. match time",
      matchTimeSub: "AI-Powered Instant Matching",
      satisfaction: "Customer satisfaction",
      satisfactionSub: "Client Happiness Score"
    },
    metrics: {
      matchTime: "Time to First Match",
      industryAvg: "vs. Industry avg",
      faster: "6x faster",
      tag: "Real Results",
      title: "Metrics",
      titleAccent: "That Matter",
      subtitle: "Our clients see measurable improvements in hiring speed, cost efficiency, and talent quality from day one.",
      reduction: "Reduction in hiring costs",
      productivity: "Faster time to productivity",
      renewal: "Average contract renewal rate"
    },
    capabilities: {
      tag: "Platform Capabilities",
      title: "Built",
      titleAccent: "for Enterprise Scale",
      subtitle: "A comprehensive platform built for the world's most demanding organizations.",
      ai: "AI-Powered Matching",
      aiDesc: "Our proprietary algorithm matches your requirements with pre-vetted talent in under 48 hours.",
      security: "Enterprise Security",
      securityDesc: "SOC 2 Type II certified. Bank-grade encryption. Full compliance with GDPR, HIPAA, and more.",
      network: "Global Talent Network",
      networkDesc: "Access verified engineers across 94+ countries, all time zones covered, 24/7 support.",
      modular: "Modular Platform",
      modularDesc: "Pick and choose the services you need. Scale up or down instantly based on demand."
    },
    cta: {
      title: "Ready to Transform",
      titleAccent: "Your IT Hiring?",
      subtitle: "Join 35+ companies using Desknet to build world-class engineering teams. Get started in minutes, not months.",
      primary: "Start Free Trial",
      secondary: "Talk to Sales"
    },
    footer: {
      desc: "Global platform connecting innovative companies with verified IT talent from 94+ countries.",
      product: "Product",
      company: "Company",
      legal: "Legal",
      rights: "All Rights Reserved",
      links: {
        features: "Features",
        postJob: "Post Job",
        findEngineers: "Find Engineers",
        getStarted: "Get Started",
        security: "Security",
        aboutUs: "About Us",
        careers: "Careers",
        contact: "Contact"
      },
      tagline: "Building the world's best IT talent network"
    },
    contact: {
      tag: "Contact Us",
      title: "Let's build the",
      titleAccent: "future",
      titleSuffix: "together",
      subtitle: "Have questions about our platform or need a custom solution? Our team is ready to help you scale your engineering operations globally.",
      form: {
        name: "Full Name",
        email: "Email Address",
        subject: "Subject",
        message: "Message",
        submit: "Send Message",
        sending: "Sending...",
        success: "Message Sent!",
        successDesc: "Thank you for reaching out. Our team will review your message and get back to you within 24 hours.",
        sendAnother: "Send another message"
      },
      info: {
        phone: { title: "Call Us", details: "+1 (888) DESKNET", sub: "Mon-Fri from 8am to 6pm" },
        email: { title: "Email Us", details: "hello@desknet.io", sub: "Online support 24/7" },
        address: { title: "Visit Us", details: "100 Tech Plaza, Suite 500", sub: "San Francisco, CA 94105" }
      }
    },
    about: {
      tag: "About Us",
      heroTitle: "Connecting exceptional tech talent with innovative companies",
      heroDesc: "Desknet is the infrastructure layer for global technical talent. We bridge the gap between the best engineers and forward-thinking companies.",
      missionTag: "Our Mission",
      missionTitle: "Transform how companies find talent and how engineers find opportunities",
      missionDesc: "Desknet is the infrastructure layer for global technical talent. We bridge the gap between the best engineers and forward-thinking companies.",
      rigorousVetting: "Rigorous Vetting",
      valuesTag: "Core Values",
      valuesTitle: "What drives us forward",
      valuesSubtitle: "Our core principles guide every decision and every feature.",
      values: {
        transparency: {
          title: "Transparency",
          desc: "Honest communication and clear terms for all parties. No hidden fees, no surprises—just straightforward collaboration."
        },
        quality: {
          title: "Quality First",
          desc: "We work only with verified engineers and serious companies committed to excellence."
        },
        compensation: {
          title: "Fair Compensation",
          desc: "Engineers deserve competitive rates. We ensure every opportunity values technical expertise."
        },
        speed: {
          title: "Speed & Efficiency",
          desc: "Time matters in tech. Our process connects talent with opportunities in days, not months."
        },
        community: {
          title: "Community Driven",
          desc: "We're not just building a platform—we're creating a community of technologists and innovators."
        },
        innovation: {
          title: "Continuous Innovation",
          desc: "Technology evolves, and we evolve with it. We continuously improve the platform."
        }
      },
      howItWorksTitle: "How Desknet Works",
      howItWorksSubtitle: "A streamlined process that benefits both engineers and companies.",
      forEngineers: "For Engineers",
      forCompanies: "For Companies",
      steps: {
        engineers: [
          { title: "Create Your Profile", desc: "Showcase your skills, experience and expected rate in minutes." },
          { title: "Get Verified", desc: "Our team verifies your profile to ensure quality matches." },
          { title: "Connect With Companies", desc: "Get opportunities that match your skills and preferences." }
        ],
        companies: [
          { title: "Post Your Requirements", desc: "Define the skills, experience and project details you need." },
          { title: "Review Matched Engineers", desc: "Review verified engineers perfectly matched to your criteria." },
          { title: "Start Building", desc: "Connect directly and start working with your new team member." }
        ]
      },
      ctaTitle: "Ready to join the network?",
      ctaSubtitle: "Start your journey today and connect with the best tech professionals and companies.",
      getStarted: "Get Started",
      learnMore: "Learn More"
    },
    testimonials: {
      tag: "Testimonials",
      title: "Trusted by",
      titleAccent: "the best",
      subtitle: "Hear from the engineering leaders and developers who are building the future on Desknet.",
      items: [
        {
          quote: "Desknet has completely transformed our hiring process. We found a Senior Architect in 48 hours who has been a game-changer for our infrastructure.",
          author: "James Wilson",
          role: "CTO at TechFlow",
          avatar: "https://picsum.photos/seed/james/100/100"
        },
        {
          quote: "As an engineer, Desknet gives me the freedom to work on world-class projects with fair compensation and full transparency. It's the platform I've been waiting for.",
          author: "Elena Rodriguez",
          role: "Senior Full Stack Engineer",
          avatar: "https://picsum.photos/seed/elena/100/100"
        },
        {
          quote: "The quality of talent on Desknet is unparalleled. Their vetting process is rigorous, ensuring we only interview the top 1% of global talent.",
          author: "Marcus Chen",
          role: "VP of Engineering at CloudScale",
          avatar: "https://picsum.photos/seed/marcus/100/100"
        }
      ]
    },
    login: {
      title: "Welcome Back",
      subtitle: "Choose your account type to continue",
      engineer: "Engineer",
      engineerDesc: "Find your next big opportunity",
      client: "Client",
      clientDesc: "Hire world-class engineering talent",
      admin: "Administrator",
      adminDesc: "Manage the Desknet platform",
      email: "Email Address",
      password: "Password",
      signIn: "Sign In",
      signInAsAdmin: "Sign In as Admin",
      signInAsEngineer: "Sign In as Engineer",
      signInAsClient: "Sign In as Client",
      forgotPassword: "Forgot Password?",
      noAccount: "Don't have an account?",
      signUp: "Sign Up",
      back: "Back to selection"
    },
    signup: {
      title: "Join Desknet",
      subtitle: "Choose your account type to get started",
      engineer: "Engineer",
      engineerDesc: "Join our network of elite engineers",
      client: "Client",
      clientDesc: "Hire verified engineering talent",
      fullName: "Full Name",
      email: "Email Address",
      password: "Password",
      companyName: "Company Name",
      firstName: "First Name",
      lastName: "Last Name",
      companyEmail: "Company Email",
      companySize: "Number of People in Company",
      createAccount: "Create Account",
      hasAccount: "Already have an account?",
      signIn: "Sign In",
      back: "Back to selection",
      continue: "Continue",
      complete: "Complete Registration",
      steps: {
        account: "Account",
        personal: "Personal",
        professional: "Professional",
        rates: "Rates",
        assets: "Assets"
      },
      fields: {
        dob: "Date of Birth",
        day: "Day",
        month: "Month",
        year: "Year",
        country: "Country",
        city: "City",
        zipCode: "Zip Code (Optional)",
        specialization: "Main IT Specialization",
        experience: "Years of Experience",
        skills: "Skills (comma separated)",
        hourlyRate: "Hourly Rate ($)",
        halfDayRate: "Half-day Rate ($)",
        fullDayRate: "Full-day Rate ($)",
        languages: "Languages",
        contactInfo: "Contact Information",
        phoneNumber: "Phone Number",
        whatsappNumber: "WhatsApp Number",
        linkedin: "LinkedIn Username (Optional)",
        facebook: "Facebook Username (Optional)",
        cvUpload: "Upload CV (PDF)",
        idUpload: "Upload ID (JPG/PNG/PDF)",
        profilePic: "Profile Picture"
      },
      onboarding: {
        step1: { title: "Date of Birth", desc: "Please provide your date of birth." },
        step2: { title: "Location", desc: "Where are you currently residing?" },
        step3: { title: "Specialization", desc: "What is your primary area of technical expertise?" },
        step4: { title: "Experience", desc: "How many years have you been working in this field?" },
        step5: { title: "Skills", desc: "List your core technical skills and tools." },
        step6: { title: "Rates", desc: "Set your expected rates for different engagement types." },
        step7: { title: "Languages", desc: "What languages do you speak and at what level?" },
        step8: { title: "Contact Info", desc: "How can companies reach out to you directly?" },
        step9: { title: "CV & ID Upload", desc: "Upload your latest CV and a copy of your ID." },
        step10: { title: "Profile Picture", desc: "Add a professional photo to your profile." },
        proficiencyLevels: {
          a1: "A1 - Beginner",
          a2: "A2 - Elementary",
          b1: "B1 - Intermediate",
          b2: "B2 - Upper Intermediate",
          c1: "C1 - Advanced",
          c2: "C2 - Proficient",
          native: "Native"
        },
        placeholders: {
          searchCountry: "Search country...",
          searchCity: "Search city...",
          zipCode: "Enter zip code",
          selectCountryFirst: "Select country first",
          selectSpecializations: "Select specializations...",
          searchSkills: "Search and add skills...",
          usdPerHour: "USD per hour",
          usdHalfDay: "USD for 4 hours",
          usdFullDay: "USD for 8 hours",
          selectLanguage: "Select Language",
          selectLevel: "Level",
          phoneNumber: "Phone number",
          whatsappNumber: "WhatsApp number",
          linkedin: "e.g. johndoe",
          facebook: "e.g. johndoe",
          uploadCV: "Upload your CV",
          uploadID: "Upload your ID",
          cvFormat: "PDF format preferred, max 5MB",
          idFormat: "JPG, PNG or PDF, max 5MB",
          confirmCV: "Confirm CV",
          confirmID: "Confirm ID",
          cvConfirmed: "CV Confirmed",
          idConfirmed: "ID Confirmed",
          yearsExperience: "Years of experience",
          countryCode: "Code",
          profilePicTitle: "Profile Picture",
          profilePicDesc: "Help companies recognize you. Square images work best.",
          choosePhoto: "Choose Photo",
          confirmPhoto: "Confirm Photo",
          photoConfirmed: "Photo Confirmed",
          change: "Change",
          cancel: "Cancel",
          back: "Back",
          completeReg: "Complete Registration",
          continue: "Continue"
        }
      }
    },
    legal: {
      terms: {
        title: "Terms of Service",
        lastUpdated: "Last updated: October 2023",
        content: `Welcome to Desknet. By using our platform, you agree to the following terms:

1. Acceptance of Terms: By accessing or using Desknet, you agree to be bound by these Terms of Service and all applicable laws and regulations.

2. User Accounts: You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.

3. Platform Usage: Desknet provides a marketplace for connecting IT talent with companies. We do not guarantee employment or project success.

4. Intellectual Property: All content on this platform is the property of Desknet or its content suppliers and is protected by international copyright laws.

5. Limitation of Liability: Desknet shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.

6. Modifications: We reserve the right to modify these terms at any time. Continued use of the platform constitutes acceptance of the new terms.`
      },
      privacy: {
        title: "Privacy Policy",
        lastUpdated: "Last updated: October 2023",
        content: `Your privacy is important to us. This policy explains how we collect, use, and protect your personal information:

1. Information Collection: We collect information you provide directly to us, such as when you create an account, update your profile, or communicate with us.

2. Use of Information: We use your information to provide, maintain, and improve our services, to process transactions, and to send you technical notices and support messages.

3. Data Sharing: We may share your information with potential employers or clients as part of the platform's core functionality. We do not sell your personal data to third parties.

4. Data Security: We implement reasonable security measures to protect your personal information from unauthorized access, disclosure, or destruction.

5. Cookies: We use cookies to enhance your experience and gather information about visitors and visits to our platform.

6. Your Rights: You have the right to access, correct, or delete your personal information at any time through your account settings.`
      },
      cookies: {
        title: "Cookie Policy",
        lastUpdated: "Last updated: October 2023",
        content: "We use cookies to improve your experience on our platform. By using Desknet, you consent to our use of cookies in accordance with our Privacy Policy."
      },
      agreeText: "I agree to the",
      andText: "and",
      agreeSuffix: ""
    },
    why: {
      tag: "Why Desknet",
      heroTitle: "Why",
      heroTitleAccent: "Desknet?",
      heroSubtitle: "Everything you need to build exceptional engineering teams",
      stats: {
        engineers: "Verified Engineers",
        countries: "Countries",
        success: "Success Rate"
      },
      watchDemo: "Watch how it works",
      benefitsTag: "benefits",
      benefitsTitle: "Everything you need to",
      benefitsTitleAccent: "succeed",
      benefitsSubtitle: "Comprehensive features designed for both engineers and companies",
      benefits: [
        { title: "Vetted Talent Pool", desc: "Every engineer on our platform is carefully vetted and verified." },
        { title: "Fair Compensation", desc: "Engineers set their own rates with full transparency." },
        { title: "Secure Payments", desc: "Our escrow system protects both parties." },
        { title: "24/7 Support", desc: "Our dedicated support team is always available." },
        { title: "Fast Matching", desc: "Our intelligent algorithm quickly connects you." },
        { title: "Global Network", desc: "Access talent from around the world." }
      ],
      verificationTag: "Verification Process",
      verificationTitle: "Every engineer,",
      verificationTitleAccent: "Thoroughly verified",
      verificationSubtitle: "Our rigorous verification process ensures you work only with top-tier professionals. Background checks, skill assessments and real-time verification.",
      verificationList: [
        "Technical Skills Assessment",
        "Background Verification",
        "Portfolio Review"
      ],
      comparisonTag: "Comparison",
      comparisonTitle: "Desknet vs",
      comparisonTitleAccent: "the rest",
      comparisonSubtitle: "Learn why leading companies choose Desknet over traditional platforms",
      comparison: {
        header: ["Feature", "Desknet", "Others"],
        rows: [
          ["Talent Verification", "Check", "Limited"],
          ["Transparent Pricing", "Check", "Hidden fees"],
          ["Escrow Protection", "Check", "Varies"],
          ["AI-Powered Matching", "Check", "Manual"],
          ["Global Reach", "94+ Countries", "Regional"],
          ["Support Response", "< 2 hours", "24-48 hours"]
        ]
      },
      networkTitle: "Truly",
      networkTitleAccent: "Global Network",
      networkSubtitle: "Access top-tier IT talent from 94+ countries with experience across all major tech stacks.",
      networkStats: [
        { label: "Engineers", value: "3,500+" },
        { label: "Companies", value: "35+" },
        { label: "Countries", value: "94+" },
        { label: "Uptime", value: "99.9%" }
      ],
      networkLive: "Live Engineers",
      networkProjects: "Active Projects",
      ctaTitle: "Ready to make a difference?",
      ctaSubtitle: "Join thousands of successful engineers and companies on Desknet today.",
      ctaEarning: "Start Earning",
      ctaHiring: "Start Hiring",
      ctaBadges: ["SOC 2 Certified", "No Hidden Fees", "24/7 Support"],
      verificationCards: {
        technical: "Technical Skills",
        verified: "Verified",
        background: "Background Check",
        passed: "Passed",
        identity: "Identity Verification",
        confirmed: "Confirmed"
      }
    },
    portal: {
      menu: {
        dashboard: "Dashboard",
        profile: "My Profile",
        bankAccountDetails: "Bank Account Details",
        tickets: "My Tickets",
        findJobs: "Find Jobs",
        messages: "Messages",
        settings: "Settings",
        logout: "Logout"
      },
      dashboard: {
        title: "Engineer Dashboard",
        welcomeBack: "Welcome back",
        assignedTickets: "Assigned Tickets",
        rating: "Rating",
        activeTasks: "Active Tasks",
        viewAll: "View All",
        liveActivity: "Live Activity",
        networkStatus: "Network Status",
        status: "Status",
        optimal: "Optimal"
      },
      profile: {
        verified: "Verified Pro",
        verifiedEngineer: "Verified Engineer",
        edit: "Edit Profile",
        stats: {
          rate: "Hourly Rate",
          halfDayRate: "Half-day Rate",
          fullDayRate: "Full-day Rate",
          experience: "Experience",
          success: "Success Rate"
        },
        skills: "Technical Skills",
        languages: "Languages",
        contactInfo: "Contact Information"
      },
      jobs: {
        searchPlaceholder: "Search for jobs, skills, or companies...",
        searchBtn: "Search Jobs",
        apply: "Apply Now",
        remote: "Remote",
        posted: "Posted"
      },
      messages: {
        recent: "Recent Chats",
        searchPlaceholder: "Search messages...",
        empty: "Select a conversation to start messaging"
      },
      settings: {
        account: "Account Settings",
        notifications: "Email Notifications",
        notificationsDesc: "Receive job alerts and messages via email",
        twoFactor: "Two-Factor Authentication",
        twoFactorDesc: "Add an extra layer of security to your account",
        privacy: "Privacy",
        visibility: "Profile Visibility",
        visibilityDesc: "Show your profile in search results",
        delete: "Delete Account",
        enable: "Enable"
      },
      logoutConfirm: {
        title: "Confirm Logout",
        message: "Are you sure you want to log out of your account?",
        confirm: "Logout",
        cancel: "Cancel"
      },
      cv: {
        view: "View CV",
        download: "Download CV"
      },
      paymentSetup: {
        title: "Payment Method Setup",
        subtitle: "Please provide your bank account details to receive payments for your completed tickets.",
        method: "Payment Method",
        bankName: "Bank Name",
        accountHolder: "Account Holder Name",
        accountNumber: "Account Number / IBAN",
        swiftCode: "SWIFT / BIC Code",
        routingNumber: "Routing Number (Optional)",
        bankAddress: "Bank Address",
        accountType: "Account Type",
        checking: "Checking",
        savings: "Savings",
        currency: "Currency",
        exit: "Exit",
        save: "Save Payment Details",
        saving: "Saving...",
        success: "Payment Details Saved",
        successDesc: "Your payment information has been updated successfully.",
        error: "Save Failed",
        errorDesc: "Failed to save payment details. Please try again."
      }
    },
    clientPortal: {
      welcome: "Client Portal",
      guest: "Guest",
      subtitle: "Select a section below to get started",
      nav: {
        home: "Home",
        logTicket: "Log a Ticket",
        myTickets: "My Tickets",
        services: "Services & Coverage",
        billing: "Billing",
        userManagement: "Manage Users",
        companyProfile: "Company Profile",
        help: "Help & Support",
        quotations: "Quotations",
        messages: "Messages",
        logout: "Log Out",
        opportunities: "Opportunities"
      },
      quotations: {
        title: "Service Quotations",
        subtitle: "Manage and track project cost estimates",
        searchPlaceholder: "Search projects...",
        requestButton: "Request Quote",
        loading: "Loading quotations...",
        estimatedAmount: "Estimated Amount",
        status: {
          draft: "Draft",
          sent: "Sent",
          approved: "Approved",
          rejected: "Rejected"
        },
        sendToClient: "Send to Client",
        approve: "Approve",
        reject: "Reject",
        approveQuote: "Approve Quote",
        noQuotations: "No quotations found",
        noQuotationsDesc: "Try adjusting your search or request a new quote",
        recent: "Recent",
        unknownClient: "Unknown Client",
        giveQuote: "Give Quote",
        quoteAmount: "Quote Amount",
        firstTwoHours: "First 2 Hours",
        additionalHours: "Add. Hours",
        travelCost: "Travel Cost",
        quoteDescription: "Quote Description",
        submitQuote: "Submit Quote",
        modal: {
          title: "Request Quotation",
          subtitle: "Tell us about your project and we'll provide a cost estimate.",
          projectName: "Project Name",
          projectNamePlaceholder: "e.g. Office Network Setup",
          description: "Description",
          descriptionPlaceholder: "Describe the scope of work...",
          estimatedBudget: "Estimated Budget (Optional)",
          estimatedBudgetPlaceholder: "e.g. 5,000",
          submit: "Submit Request"
        },
        notifications: {
          requestSentTitle: "Request Sent",
          requestSentMessage: "Your quotation request has been sent successfully!",
          requestFailedTitle: "Request Failed",
          requestFailedMessage: "Failed to send quotation request.",
          statusUpdatedTitle: "Status Updated",
          statusUpdatedMessage: "Quotation status updated to {status}.",
          updateFailedTitle: "Update Failed",
          updateFailedMessage: "Failed to update quotation status."
        }
      },
      stats: {
        activeTickets: "Active Tickets",
        activeTicketsDesc: "Currently open requests",
        teamMembers: "Team Members",
        teamMembersDesc: "Managed accounts"
      },
      cards: {
        quickActions: { name: "Quick Actions", desc: "Access frequently used features and shortcuts for common tasks" },
        logTicket: { name: "Log New Ticket", desc: "Create and submit a new support ticket or service request" },
        activeTickets: { name: "Active Tickets", desc: "View summary of your currently active and open tickets" },
        awaitingAction: { name: "Awaiting Action", desc: "Tickets requiring your attention or approval" },
        updates: { name: "Recent Updates & Notifications", desc: "Stay informed about all account activity and updates" },
        startOpportunity: { name: "Start New Opportunity", desc: "Initiate a new project or resource request" },
        coordinator: { name: "Assigned Desknet Coordinator", desc: "Contact information and details for your dedicated Desknet coordinator" },
        accountStatus: { name: "Account Status", desc: "Overview of your account status, billing, and service details" }
      },
      common: {
        back: "Back",
        return: "Return to",
        updating: "Updating Content",
        updatingDesc: "This section is currently being updated with the latest data and features for your account. Please check back soon or contact support if you need immediate assistance.",
        edit: "Edit",
        submit: "Submit",
        confirm: "Confirm",
        cancel: "Cancel",
        loading: "Loading...",
        noData: "No data found",
        viewAll: "View All",
        online: "Online",
        typeMessage: "Type your message...",
        noMessages: "No messages yet. Start a conversation with support!"
      },
      logTicket: {
        title: "Log a New Ticket",
        serviceType: "Service Type",
        estimatedDuration: "Estimated Duration",
        priority: "Priority",
        subject: "Subject",
        description: "Detailed Description",
        country: "Country",
        city: "City",
        location: "Full Location",
        contactEmail: "Contact Email",
        contactPhone: "Contact Phone Number",
        specialInstructions: "Special Instructions",
        ticketNumber: "Ticket Number",
        dateTime: "Preferred Date/Time",
        review: "Review Ticket",
        edit: "Edit Ticket",
        confirm: "Confirm & Submit",
        submitting: "Submitting...",
        steps: {
          service: "Service",
          location: "Location",
          contact: "Contact",
          details: "Details",
          review: "Review"
        },
        placeholders: {
          subject: "Brief description of the issue",
          description: "Provide as much detail as possible...",
          location: "Full site address",
          estimatedDuration: "e.g. 4 hours, 2 days",
          country: "Select country",
          city: "Enter city",
          contactEmail: "contact@example.com",
          contactPhone: "+1 234 567 890",
          specialInstructions: "Any specific access requirements or site-specific rules...",
          ticketNumber: "Internal reference number"
        },
        options: {
          serviceTypes: {
            onDemand: "On-Demand Dispatch",
            project: "Project-Based",
            maintenance: "Maintenance",
            hourly: "Hourly",
            halfDay: "Half Day",
            fullDay: "Full Day"
          },
          priorities: {
            low: "Low",
            medium: "Medium",
            high: "High",
            critical: "Critical (SLA)"
          }
        }
      },
      myTickets: {
        title: "My Tickets",
        table: {
          id: "ID",
          subject: "Subject",
          status: "Status",
          engineer: "Engineer",
          date: "Date",
          priority: "Priority",
          type: "Type",
          actions: "Actions",
          seeMore: "See More"
        },
        filters: {
          all: "All",
          status: "Status",
          priority: "Priority",
          search: "Search tickets..."
        },
        status: {
          completed: "Completed",
          resolved: "Resolved",
          inProgress: "In Progress",
          onSite: "Engineer On Site",
          assigned: "Engineer Assigned",
          quoteAccepted: "Quote Accepted",
          quoted: "Quoted",
          approved: "Approved",
          rejected: "Rejected",
          open: "Open",
          waitingForConfirmation: "Waiting for Confirmation",
          confirmCompletion: "Confirm Completion",
          rateEngineer: "How would you rate the engineer?",
          ratingSuccess: "Thank you for your feedback!"
        }
      },
      billing: {
        title: "Billing & Invoices",
        balance: "Current Balance",
        pending: "Pending Advice",
        nextBilling: "Next Billing Date",
        recentInvoices: "Recent Invoices"
      },
      subItems: {
        myTickets: {
          list: "Ticket List",
          filters: "Filters",
          timeline: "Ticket Status Timeline",
          quotation: "Quotation & Cost Visibility",
          engineer: "Engineer Assignment Details",
          comments: "Ticket Comments & Updates",
          completion: "Completion & Feedback Actions"
        },
        services: {
          catalog: "Services Catalog",
          models: "Engagement Models",
          coverage: "Country Coverage",
          rates: "Standard Rate Guidelines",
          notes: "Commercial Notes"
        },
        billing: {
          advice: "Monthly Billing Advice",
          approval: "Billing Advice Approval",
          invoices: "Invoices",
          history: "Billing History"
        },
        userManagement: {
          addRemove: "Add/Remove Users",
          access: "Access Control"
        },
        opportunities: {
          dispatch: "On-Demand Dispatch",
          project: "Project-Based",
          contract: "Contract-Based",
          fte: "Full-Time Equivalent",
          msp: "Managed Services",
          tracking: "Opportunity Tracking"
        },
        companyProfile: {
          details: "Company Details",
          contact: "Contact Details",
          location: "Location",
          billing: "Billing Information",
          operating: "Operating Countries",
          industry: "Industry"
        },
        help: {
          howItWorks: "How It Works",
          faqs: "FAQs",
          contact: "Support Contact Details",
          country: "Country Support",
          city: "City Support",
          guidelines: "Portal Guidelines",
          mapTimeZones: "Map & Time Zones",
          dispatcherTools: "Dispatcher Tools",
          trucks: "Trucks"
        }
      },
      services: {
        title: "Services & Coverage",
        itManagement: { title: "IT Management & Deployment", price: "Custom Quote", desc: "We manage your IT systems from start to finish — including setup, upgrades, and moving your infrastructure or software — to keep your business running without interruptions." },
        infrastructure: { title: "Infrastructure Build & Configuration", price: "Custom Quote", desc: "FIXORE IT Global designs, builds, and improves IT systems to match your goals, ensuring high performance, easy growth, and full compliance with all standards." },
        support: { title: "End-User & Network Support", price: "Custom Quote", desc: "Multi-level IT support is provided through onsite, remote, and network services, ensuring fast response and reliable operation for every business." },
        maintenance: { title: "Maintenance & IMAC Services", price: "Custom Quote", desc: "Break-fix and full IMAC (Install, Move, Add, Change) services that keep daily IT work running smoothly and reduce downtime as much as possible." },
        asset: { title: "Asset Lifecycle & Recycling", price: "Custom Quote", desc: "Safe and responsible IT asset management that covers removal, reuse, disposal, and resale — following strict data security and environmental standards." },
        coverage: {
          title: "Global Coverage",
          desc: "We provide services in 94+ countries with a network of 20,000+ certified engineers.",
          cta: "View Coverage Map"
        }
      },
      userManagement: {
        title: "Manage Users",
        addUser: "Add User",
        noUsers: "No sub-users found. Add your first team member!"
      },
      companyProfile: {
        title: "Company Profile",
        memberSince: "Member since",
        generalInfo: "General Information",
        industry: "Industry",
        employees: "Employees",
        website: "Website",
        contactDetails: "Contact Details",
        primaryAddress: "Primary Address",
        country: "Country",
        city: "City",
        location: "Full Location",
        description: "Company Description",
        taxId: "Tax ID / VAT Number",
        yearFounded: "Year Founded",
        linkedin: "LinkedIn Profile",
        primaryContact: "Primary Contact Person"
      },
      help: {
        title: "Help & Support",
        faqs: "Frequently Asked Questions",
        faqItems: [
          { q: 'What is the SLA for critical tickets?', a: 'Critical tickets have a 4-hour on-site response time guarantee.' },
          { q: 'How are engineers vetted?', a: 'All engineers undergo technical assessments and background checks.' },
          { q: 'Can I cancel a scheduled dispatch?', a: 'Yes, but cancellations within 24 hours may incur a fee.' }
        ],
        howItWorksItems: [
          { step: '01', title: 'Log Ticket', desc: 'Submit your request via the portal.' },
          { step: '02', title: 'Assignment', desc: 'We match a verified engineer.' },
          { step: '03', title: 'Execution', desc: 'Engineer performs the work on-site.' },
          { step: '04', title: 'Completion', desc: 'Review and approve the service.' }
        ],
        immediateHelp: "Need Immediate Help?",
        supportCenter: "Global Support Center",
        accountManager: "Account Manager",
        managerName: "Alex Thompson",
        managerRole: "Dedicated Success Manager",
        supportDesc: "Our support team is available 24/7 to assist you with any technical issues.",
        liveChat: "Live Chat",
        waitTime: "Average wait time: 2 mins",
        startChat: "Start Chat"
      },
      messages: {
        title: "Messages",
        conversations: "Conversations",
        activeChat: "Active Support Chat"
      },
      addUser: {
        title: "Add New User",
        username: "Username",
        usernamePlaceholder: "Enter username",
        email: "Email Address",
        emailPlaceholder: "user@company.com",
        role: "Role",
        roles: {
          admin: "Admin",
          manager: "Manager",
          viewer: "Viewer"
        },
        submit: "Create User"
      }
    },
    settings: {
      title: "Settings",
      profile: "Profile",
      security: "Security",
      notifications: "Notifications",
      preferences: "Preferences",
      profileInfo: "Profile Information",
      profileDesc: "Update your personal details and how others see you on the platform.",
      fullName: "Full Name",
      email: "Email Address",
      phone: "Phone Number",
      saveChanges: "Save Changes",
      securitySettings: "Security Settings",
      securityDesc: "Manage your password and account security preferences.",
      passwordReq: "Password Requirements",
      passwordReqDesc: "To keep your account secure, passwords must be at least 8 characters long and include a mix of letters, numbers, and symbols.",
      newPassword: "New Password",
      confirmPassword: "Confirm New Password",
      updatePassword: "Update Password",
      notifPrefs: "Notification Preferences",
      notifDesc: "Control how and when you receive updates from the Desknet platform.",
      emailNotif: "Email Notifications",
      emailNotifDesc: "Receive updates about tickets, jobs, and invoices via email.",
      pushNotif: "Push Notifications",
      pushNotifDesc: "Get real-time alerts in your browser or mobile device.",
      smsNotif: "SMS Alerts",
      smsNotifDesc: "Receive critical system alerts via text message.",
      marketingNotif: "Marketing Updates",
      marketingNotifDesc: "Stay informed about new features and platform improvements.",
      saveNotif: "Save Notification Settings",
      platformPrefs: "Platform Preferences",
      platformDesc: "Customize your interface and localization settings.",
      language: "Language",
      appearance: "Appearance",
      light: "Light",
      dark: "Dark",
      timezone: "Timezone",
      savePrefs: "Save Preferences",
      dangerZone: "Danger Zone",
      deleteAccount: "Delete Account",
      deleteDesc: "Permanently delete your account and all associated data. This action cannot be undone.",
      deleteConfirmTitle: "Are you absolutely sure?",
      deleteConfirmDesc: "This action is permanent and cannot be undone. All your data, tickets, and messages will be lost forever.",
      deleteConfirmButton: "Yes, Delete My Account",
      cancel: "Cancel",
      successProfile: "Profile updated successfully!",
      errorProfile: "Failed to update profile. Please try again.",
      successPassword: "Password updated successfully!",
      errorPassword: "Failed to update password.",
      successNotif: "Notification preferences saved!",
      errorNotif: "Failed to save notifications.",
      successPrefs: "Platform preferences updated!",
      errorPrefs: "Failed to update preferences.",
      errorDelete: "Failed to delete account."
    },
    messaging: {
      translate: "Translate message",
      translated: "Translated",
      showOriginal: "Show original"
    },
    aiChat: {
      title: "GEN-AI Assistant",
      placeholder: "Ask anything about our services...",
      welcome: "Welcome to the future of engineering. I am GEN-AI, your advanced intelligence assistant. How can I optimize your experience today?",
      error: "Sorry, I encountered an error. Please try again.",
      clear: "Clear chat",
      close: "Close sidebar"
    }
  },
  ru: {
    nav: {
      home: "Главная",
      signUp: "Регистрация",
      platform: "Платформа",
      solutions: "Решения",
      pricing: "Цены",
      resources: "Ресурсы",
      login: "Войти",
      contact: "Контакты",
      getStarted: "Начать"
    },
    ticket: {
      tag: "Поддержка",
      title: "Создать",
      titleAccent: "Тикет",
      subtitle: "Нужна помощь? Наша служба поддержки готова помочь вам с любыми техническими вопросами или вопросами по аккаунту.",
      steps: {
        category: "Категория",
        details: "Детали",
        priority: "Приоритет",
        review: "Проверка"
      },
      fields: {
        type: "Тип проблемы",
        subject: "Тема",
        description: "Описание",
        urgency: "Срочность",
        impact: "Влияние"
      },
      placeholders: {
        subject: "Кратко опишите проблему",
        description: "Предоставьте как можно больше деталей..."
      },
      submit: "Отправить тикет",
      success: "Тикет успешно отправлен",
      successDesc: "Наша команда рассмотрит ваш запрос и свяжется с вами в ближайшее время."
    },
    hero: {
      title: "Найдите лучших",
      titleAccent: "IT-талантов по всему миру",
      subtitle: "Свяжитесь с проверенными инженерами из 94+ стран. Создайте команду своей мечты за считанные дни, а не месяцы.",
      ctaPrimary: "Начать найм",
      ctaSecondary: "Смотреть демо"
    },
    trusted: "Нам доверяют лидеры индустрии",
    stats: {
      tag: "В цифрах",
      title: "Масштабирование",
      titleAccent: "корпоративного уровня",
      subtitle: "Присоединяйтесь к самым быстрорастущим компаниям мира, которые доверяют Desknet в поиске IT-талантов",
      verified: "Проверенные инженеры",
      verifiedSub: "Готовые к работе специалисты",
      partners: "Компании-партнеры",
      partnersSub: "Надежные партнеры",
      matchTime: "ср. время подбора",
      matchTimeSub: "Мгновенный подбор на базе ИИ",
      satisfaction: "Удовлетворенность клиентов",
      satisfactionSub: "Индекс счастья клиентов"
    },
    metrics: {
      matchTime: "Время до первого совпадения",
      industryAvg: "по сравнению со средним по отрасли",
      faster: "в 6 раз быстрее",
      tag: "Реальные результаты",
      title: "Метрики,",
      titleAccent: "которые имеют значение",
      subtitle: "Наши клиенты видят измеримые улучшения в скорости найма, эффективности затрат и качестве талантов с первого дня.",
      reduction: "Снижение затрат на найм",
      productivity: "Быстрый выход на продуктивность",
      renewal: "Средний уровень продления контрактов"
    },
    capabilities: {
      tag: "Возможности платформы",
      title: "Создано",
      titleAccent: "для корпоративного масштаба",
      subtitle: "Комплексная платформа, созданная для самых требовательных организаций мира.",
      ai: "Подбор на базе ИИ",
      aiDesc: "Наш запатентованный алгоритм подбирает специалистов под ваши требования менее чем за 48 часов.",
      security: "Корпоративная безопасность",
      securityDesc: "Сертификация SOC 2 Type II. Шифрование банковского уровня. Полное соответствие GDPR, HIPAA и др.",
      network: "Глобальная сеть талантов",
      networkDesc: "Доступ к проверенным инженерам в 94+ странах, охват всех часовых поясов, поддержка 24/7.",
      modular: "Модульная платформа",
      modularDesc: "Выбирайте только нужные услуги. Мгновенно масштабируйтесь в зависимости от спроса."
    },
    cta: {
      title: "Готовы трансформировать",
      titleAccent: "найм в IT?",
      subtitle: "Присоединяйтесь к 35+ компаниям, использующим Desknet для создания инженерных команд мирового уровня. Начните за минуты, а не месяцы.",
      primary: "Начать пробный период",
      secondary: "Связаться с отделом продаж"
    },
    footer: {
      desc: "Глобальная платформа для поиска и управления IT-талантами корпоративного уровня.",
      product: "Продукт",
      company: "Компания",
      legal: "Юридическая информация",
      rights: "Все права защищены.",
      links: {
        features: "Возможности",
        postJob: "Разместить вакансию",
        findEngineers: "Найти инженеров",
        getStarted: "Начать",
        security: "Безопасность",
        aboutUs: "О нас",
        careers: "Карьера",
        contact: "Контакты"
      },
      tagline: "Создаем лучшую в мире сеть IT-талантов"
    },
    contact: {
      tag: "Свяжитесь с нами",
      title: "Давайте строить",
      titleAccent: "будущее",
      titleSuffix: "вместе",
      subtitle: "Есть вопросы о нашей платформе или нужно индивидуальное решение? Наша команда готова помочь вам масштабировать ваши инженерные операции по всему миру.",
      form: {
        name: "Полное имя",
        email: "Электронная почта",
        subject: "Тема",
        message: "Сообщение",
        submit: "Отправить сообщение",
        sending: "Отправка...",
        success: "Сообщение отправлено!",
        successDesc: "Спасибо за обращение. Наша команда рассмотрит ваше сообщение и свяжется с вами в течение 24 часов.",
        sendAnother: "Отправить еще одно сообщение"
      },
      info: {
        phone: { title: "Позвоните нам", details: "+1 (888) DESKNET", sub: "Пн-Пт с 8:00 до 18:00" },
        email: { title: "Напишите нам", details: "hello@desknet.io", sub: "Онлайн поддержка 24/7" },
        address: { title: "Посетите нас", details: "100 Tech Plaza, Suite 500", sub: "Сан-Франциско, Калифорния 94105" }
      }
    },
    about: {
      tag: "О нас",
      heroTitle: "Объединяем исключительные IT-таланты с инновационными компаниями",
      heroDesc: "Desknet — это инфраструктурный слой для глобальных технических талантов. Мы сокращаем разрыв между лучшими инженерами и дальновидными компаниями.",
      missionTag: "Наша миссия",
      missionTitle: "Трансформировать то, как компании находят таланты, а инженеры — возможности",
      missionDesc: "Desknet — это инфраструктурный слой для глобальных технических талантов. Мы сокращаем разрыв между лучшими инженерами и дальновидными компаниями.",
      rigorousVetting: "Строгий отбор",
      valuesTag: "Основные ценности",
      valuesTitle: "Что движет нами вперед",
      valuesSubtitle: "Наши основные принципы определяют каждое решение и каждую функцию.",
      values: {
        transparency: {
          title: "Прозрачность",
          desc: "Честное общение и четкие условия для всех сторон. Никаких скрытых комиссий, никаких сюрпризов — только прямое сотрудничество."
        },
        quality: {
          title: "Качество прежде всего",
          desc: "Мы работаем только с проверенными инженерами и серьезными компаниями, стремящимися к совершенству."
        },
        compensation: {
          title: "Справедливое вознаграждение",
          desc: "Инженеры заслуживают конкурентоспособных ставок. Мы гарантируем, что каждая возможность ценит технический опыт."
        },
        speed: {
          title: "Скорость и эффективность",
          desc: "В технологиях время имеет значение. Наш процесс связывает таланты с возможностями за считанные дни, а не месяцы."
        },
        community: {
          title: "Ориентированность на сообщество",
          desc: "Мы не просто строим платформу — мы создаем сообщество технологов и инноваторов."
        },
        innovation: {
          title: "Постоянные инновации",
          desc: "Технологии развиваются, и мы развиваемся вместе с ними. Мы постоянно совершенствуем платформу."
        }
      },
      howItWorksTitle: "Как работает Desknet",
      howItWorksSubtitle: "Оптимизированный процесс, который приносит пользу как инженерам, так и компаниям.",
      forEngineers: "Для инженеров",
      forCompanies: "Для компаний",
      steps: {
        engineers: [
          { title: "Создайте свой профиль", desc: "Продемонстрируйте свои навыки, опыт и ожидаемую ставку за считанные минуты." },
          { title: "Пройдите верификацию", desc: "Наша команда проверяет ваш профиль, чтобы гарантировать качественные совпадения." },
          { title: "Связывайтесь с компаниями", desc: "Получайте возможности, соответствующие вашим навыкам и предпочтениям." }
        ],
        companies: [
          { title: "Разместите свои требования", desc: "Определите необходимые навыки, опыт и детали проекта." },
          { title: "Просмотрите подходящих инженеров", desc: "Изучите проверенных инженеров, идеально подходящих под ваши критерии." },
          { title: "Начните работу", desc: "Связывайтесь напрямую и начинайте работать с новым членом вашей команды." }
        ]
      },
      ctaTitle: "Готовы присоединиться к сети?",
      ctaSubtitle: "Начните свое путешествие сегодня и свяжитесь с лучшими техническими специалистами и компаниями.",
      getStarted: "Начать",
      learnMore: "Узнать больше"
    },
    testimonials: {
      tag: "Отзывы",
      title: "Нам доверяют",
      titleAccent: "лучшие",
      subtitle: "Узнайте мнение инженерных лидеров и разработчиков, которые строят будущее вместе с Desknet.",
      items: [
        {
          quote: "Desknet полностью изменил наш процесс найма. Мы нашли ведущего архитектора за 48 часов, и он стал ключевым игроком в развитии нашей инфраструктуры.",
          author: "Джеймс Уилсон",
          role: "CTO в TechFlow",
          avatar: "https://picsum.photos/seed/james/100/100"
        },
        {
          quote: "Как инженер, Desknet дает мне свободу работать над проектами мирового уровня со справедливым вознаграждением и полной прозрачностью. Это именно та платформа, которую я ждал.",
          author: "Елена Родригес",
          role: "Senior Full Stack Engineer",
          avatar: "https://picsum.photos/seed/elena/100/100"
        },
        {
          quote: "Качество талантов в Desknet не имеет равных. Их процесс отбора очень строгий, что гарантирует нам интервью только с лучшим 1% мировых талантов.",
          author: "Маркус Чен",
          role: "VP of Engineering в CloudScale",
          avatar: "https://picsum.photos/seed/marcus/100/100"
        }
      ]
    },
    login: {
      title: "С возвращением",
      subtitle: "Выберите тип аккаунта, чтобы продолжить",
      engineer: "Инженер",
      engineerDesc: "Найдите свою следующую большую возможность",
      client: "Клиент",
      clientDesc: "Наймите инженерные таланты мирового уровня",
      admin: "Администратор",
      adminDesc: "Управление платформой Desknet",
      email: "Электронная почта",
      password: "Пароль",
      signIn: "Войти",
      signInAsAdmin: "Войти как админ",
      signInAsEngineer: "Войти как инженер",
      signInAsClient: "Войти как клиент",
      forgotPassword: "Забыли пароль?",
      noAccount: "Нет аккаунта?",
      signUp: "Зарегистрироваться",
      back: "Назад к выбору"
    },
    signup: {
      title: "Присоединяйтесь к Desknet",
      subtitle: "Выберите тип аккаунта, чтобы начать",
      engineer: "Инженер",
      engineerDesc: "Присоединяйтесь к нашей сети элитных инженеров",
      client: "Клиент",
      clientDesc: "Наймите проверенных инженерных талантов",
      fullName: "Полное имя",
      email: "Электронная почта",
      password: "Пароль",
      companyName: "Название компании",
      firstName: "Имя",
      lastName: "Фамилия",
      companyEmail: "Рабочая почта",
      companySize: "Количество сотрудников",
      createAccount: "Создать аккаунт",
      hasAccount: "Уже есть аккаунт?",
      signIn: "Войти",
      back: "Назад к выбору",
      continue: "Продолжить",
      complete: "Завершить регистрацию",
      steps: {
        account: "Аккаунт",
        personal: "Личные данные",
        professional: "Опыт",
        rates: "Ставки",
        assets: "Файлы"
      },
      fields: {
        dob: "Дата рождения",
        day: "День",
        month: "Месяц",
        year: "Год",
        country: "Страна",
        city: "Город",
        zipCode: "Почтовый индекс (необязательно)",
        specialization: "Основная специализация",
        experience: "Лет опыта",
        skills: "Навыки (через запятую)",
        hourlyRate: "Почасовая ставка ($)",
        halfDayRate: "Ставка за полдня ($)",
        fullDayRate: "Ставка за полный день ($)",
        languages: "Языки",
        contactInfo: "Контактная информация",
        phoneNumber: "Номер телефона",
        whatsappNumber: "Номер WhatsApp",
        linkedin: "Имя пользователя LinkedIn (необязательно)",
        facebook: "Имя пользователя Facebook (необязательно)",
        cvUpload: "Загрузить CV (PDF)",
        idUpload: "Загрузить ID (JPG/PNG/PDF)",
        profilePic: "Фото профиля"
      },
      onboarding: {
        step1: { title: "Дата рождения", desc: "Пожалуйста, укажите вашу дату рождения." },
        step2: { title: "Местоположение", desc: "Где вы сейчас проживаете?" },
        step3: { title: "Специализация", desc: "Какова ваша основная область технических знаний?" },
        step4: { title: "Опыт работы", desc: "Сколько лет вы работаете в этой области?" },
        step5: { title: "Навыки", desc: "Перечислите ваши основные технические навыки и инструменты." },
        step6: { title: "Ставки", desc: "Установите ожидаемые ставки для различных типов взаимодействия." },
        step7: { title: "Языки", desc: "На каких языках вы говорите и на каком уровне?" },
        step8: { title: "Контактная информация", desc: "Как компании могут связаться с вами напрямую?" },
        step9: { title: "Загрузка CV и ID", desc: "Загрузите ваше последнее резюме и копию вашего удостоверения личности." },
        step10: { title: "Фото профиля", desc: "Добавьте профессиональное фото в свой профиль." },
        proficiencyLevels: {
          a1: "A1 - Начальный",
          a2: "A2 - Элементарный",
          b1: "B1 - Средний",
          b2: "B2 - Выше среднего",
          c1: "C1 - Продвинутый",
          c2: "C2 - Свободное владение",
          native: "Родной"
        },
        placeholders: {
          searchCountry: "Поиск страны...",
          searchCity: "Поиск города...",
          zipCode: "Введите почтовый индекс",
          selectCountryFirst: "Сначала выберите страну",
          selectSpecializations: "Выберите специализации...",
          searchSkills: "Поиск и добавление навыков...",
          usdPerHour: "USD в час",
          usdHalfDay: "USD за 4 часа",
          usdFullDay: "USD за 8 часов",
          selectLanguage: "Выберите язык",
          selectLevel: "Уровень",
          phoneNumber: "Номер телефона",
          whatsappNumber: "Номер WhatsApp",
          linkedin: "например, johndoe",
          facebook: "например, johndoe",
          uploadCV: "Загрузите ваше CV",
          uploadID: "Загрузите ваше удостоверение личности",
          cvFormat: "Предпочтительно PDF, макс. 5МБ",
          idFormat: "JPG, PNG или PDF, макс. 5МБ",
          confirmCV: "Подтвердить CV",
          confirmID: "Подтвердить ID",
          cvConfirmed: "CV подтверждено",
          idConfirmed: "ID подтверждено",
          yearsExperience: "Лет опыта",
          countryCode: "Код",
          profilePicTitle: "Фото профиля",
          profilePicDesc: "Помогите компаниям узнать вас. Квадратные изображения работают лучше всего.",
          choosePhoto: "Выбрать фото",
          confirmPhoto: "Подтвердить фото",
          photoConfirmed: "Фото подтверждено",
          change: "Изменить",
          cancel: "Отмена",
          back: "Назад",
          completeReg: "Завершить регистрацию",
          continue: "Продолжить"
        }
      }
    },
    legal: {
      terms: {
        title: "Условия обслуживания",
        lastUpdated: "Последнее обновление: Октябрь 2023",
        content: `Добро пожаловать в Desknet. Используя нашу платформу, вы соглашаетесь со следующими условиями:

1. Принятие условий: Доступ к Desknet или его использование означает ваше согласие с данными Условиями обслуживания и всеми применимыми законами и правилами.

2. Учетные записи пользователей: Вы несете ответственность за сохранение конфиденциальности вашей учетной записи и пароля. Вы соглашаетесь принять на себя ответственность за все действия, которые происходят под вашей учетной записью.

3. Использование платформы: Desknet предоставляет торговую площадку для связи ИТ-специалистов с компаниями. Мы не гарантируем трудоустройство или успех проекта.

4. Интеллектуальная собственность: Весь контент на этой платформе является собственностью Desknet или ее поставщиков контента и защищен международными законами об авторском праве.

5. Ограничение ответственности: Desknet не несет ответственности за любые косвенные, случайные, специальные, вытекающие или штрафные убытки, возникшие в результате использования вами сервиса.

6. Изменения: Мы оставляем за собой право изменять эти условия в любое время. Продолжение использования платформы означает принятие новых условий.`
      },
      privacy: {
        title: "Политика конфиденциальности",
        lastUpdated: "Последнее обновление: Октябрь 2023",
        content: `Ваша конфиденциальность важна для нас. В этой политике объясняется, как мы собираем, используем и защищаем вашу личную информацию:

1. Сбор информации: Мы собираем информацию, которую вы предоставляете нам напрямую, например, когда вы создаете учетную запись, обновляете свой профиль или общаетесь с нами.

2. Использование информации: Мы используем вашу информацию для предоставления, поддержки и улучшения наших услуг, обработки транзакций и отправки вам технических уведомлений и сообщений службы поддержки.

3. Обмен данными: Мы можем делиться вашей информацией с потенциальными работодателями или клиентами в рамках основных функций платформы. Мы не продаем ваши личные данные третьим лицам.

4. Безопасность данных: Мы принимаем разумные меры безопасности для защиты вашей личной информации от несанкционированного доступа, раскрытия или уничтожения.

5. Файлы cookie: Мы используем файлы cookie, чтобы улучшить ваш опыт и собрать информацию о посетителях и посещениях нашей платформы.

6. Ваши права: Вы имеете право на доступ, исправление или удаление вашей личной информации в любое время через настройки вашей учетной записи.`
      },
      cookies: {
        title: "Политика использования файлов cookie",
        lastUpdated: "Последнее обновление: Октябрь 2023",
        content: "Мы используем файлы cookie, чтобы улучшить ваш опыт работы на нашей платформе. Используя Desknet, вы соглашаетесь на использование нами файлов cookie в соответствии с нашей Политикой конфиденциальности."
      },
      agreeText: "Я согласен с",
      andText: "и",
      agreeSuffix: ""
    },
    why: {
      tag: "Почему Desknet",
      heroTitle: "Почему",
      heroTitleAccent: "Desknet?",
      heroSubtitle: "Все, что вам нужно для создания исключительных инженерных команд",
      stats: {
        engineers: "Проверенные инженеры",
        countries: "Страны",
        success: "Успешность"
      },
      watchDemo: "Посмотрите, как это работает",
      benefitsTag: "преимущества",
      benefitsTitle: "Все, что вам нужно для",
      benefitsTitleAccent: "успеха",
      benefitsSubtitle: "Комплексные функции, разработанные как для инженеров, так и для компаний",
      benefits: [
        { title: "Проверенный пул талантов", desc: "Каждый инженер на нашей платформе проходит тщательную проверку и верификацию." },
        { title: "Справедливое вознаграждение", desc: "Инженеры сами устанавливают свои ставки при полной прозрачности." },
        { title: "Безопасные платежи", desc: "Наша система эскроу защищает обе стороны." },
        { title: "Поддержка 24/7", desc: "Наша специальная служба поддержки всегда доступна." },
        { title: "Быстрый подбор", desc: "Наш интеллектуальный алгоритм быстро связывает вас." },
        { title: "Глобальная сеть", desc: "Доступ к талантам со всего мира." }
      ],
      verificationTag: "Процесс верификации",
      verificationTitle: "Каждый инженер,",
      verificationTitleAccent: "Тщательно проверен",
      verificationSubtitle: "Наш строгий процесс верификации гарантирует, что вы работаете только с профессионалами высшего уровня. Проверка биографии, оценка навыков и верификация в реальном времени.",
      verificationList: [
        "Оценка технических навыков",
        "Проверка биографии",
        "Обзор портфолио"
      ],
      comparisonTag: "Сравнение",
      comparisonTitle: "Desknet против",
      comparisonTitleAccent: "остальных",
      comparisonSubtitle: "Узнайте, почему ведущие компании выбирают Desknet вместо традиционных платформ",
      comparison: {
        header: ["Функция", "Desknet", "Другие"],
        rows: [
          ["Верификация талантов", "Check", "Ограничено"],
          ["Прозрачное ценообразование", "Check", "Скрытые комиссии"],
          ["Защита эскроу", "Check", "Варьируется"],
          ["Подбор на базе ИИ", "Check", "Вручную"],
          ["Глобальный охват", "94+ Страны", "Региональный"],
          ["Ответ поддержки", "< 2 часов", "24-48 часов"]
        ]
      },
      networkTitle: "По-настоящему",
      networkTitleAccent: "Глобальная сеть",
      networkSubtitle: "Доступ к высококлассным IT-талантам из 94+ стран с опытом работы во всех основных технологических стеках.",
      networkStats: [
        { label: "Инженеры", value: "3,500+" },
        { label: "Компании", value: "35+" },
        { label: "Страны", value: "94+" },
        { label: "Uptime", value: "99.9%" }
      ],
      networkLive: "Инженеры онлайн",
      networkProjects: "Активные проекты",
      ctaTitle: "Готовы внести свой вклад?",
      ctaSubtitle: "Присоединяйтесь к тысячам успешных инженеров и компаний на Desknet уже сегодня.",
      ctaEarning: "Начать зарабатывать",
      ctaHiring: "Начать найм",
      ctaBadges: ["Сертификация SOC 2", "Без скрытых комиссий", "Поддержка 24/7"],
      verificationCards: {
        technical: "Технические навыки",
        verified: "Проверено",
        background: "Проверка биографии",
        passed: "Пройдено",
        identity: "Верификация личности",
        confirmed: "Подтверждено"
      }
    },
    portal: {
      menu: {
        dashboard: "Панель управления",
        profile: "Мой профиль",
        bankAccountDetails: "Банковские реквизиты",
        tickets: "Мои тикеты",
        findJobs: "Поиск работы",
        messages: "Сообщения",
        settings: "Настройки",
        logout: "Выйти"
      },
      dashboard: {
        title: "Панель инженера",
        welcomeBack: "С возвращением",
        assignedTickets: "Назначенные тикеты",
        rating: "Рейтинг",
        activeTasks: "Активные задачи",
        viewAll: "Посмотреть все",
        liveActivity: "Активность в реальном времени",
        networkStatus: "Статус сети",
        status: "Статус",
        optimal: "Оптимально"
      },
      profile: {
        verified: "Проверенный профи",
        verifiedEngineer: "Проверенный инженер",
        edit: "Редактировать профиль",
        stats: {
          rate: "Почасовая ставка",
          halfDayRate: "Ставка за полдня",
          fullDayRate: "Ставка за полный день",
          experience: "Опыт",
          success: "Успешность"
        },
        skills: "Технические навыки",
        languages: "Языки",
        contactInfo: "Контактная информация"
      },
      jobs: {
        searchPlaceholder: "Поиск работы, навыков или компаний...",
        searchBtn: "Найти работу",
        apply: "Подать заявку",
        remote: "Удаленно",
        posted: "Опубликовано"
      },
      messages: {
        recent: "Недавние чаты",
        searchPlaceholder: "Поиск сообщений...",
        empty: "Выберите чат, чтобы начать общение"
      },
      settings: {
        account: "Настройки аккаунта",
        notifications: "Email уведомления",
        notificationsDesc: "Получать оповещения о работе и сообщения по почте",
        twoFactor: "Двухфакторная аутентификация",
        twoFactorDesc: "Добавьте дополнительный уровень безопасности",
        privacy: "Конфиденциальность",
        visibility: "Видимость профиля",
        visibilityDesc: "Показывать ваш профиль в результатах поиска",
        delete: "Удалить аккаунт",
        enable: "Включить"
      },
      logoutConfirm: {
        title: "Подтверждение выхода",
        message: "Вы уверены, что хотите выйти из своего аккаунта?",
        confirm: "Выйти",
        cancel: "Отмена"
      },
      cv: {
        view: "Посмотреть CV",
        download: "Скачать CV"
      },
      paymentSetup: {
        title: "Настройка способа оплаты",
        subtitle: "Пожалуйста, укажите данные вашего банковского счета для получения оплаты за выполненные заявки.",
        method: "Способ оплаты",
        bankName: "Название банка",
        accountHolder: "Имя владельца счета",
        accountNumber: "Номер счета / IBAN",
        swiftCode: "SWIFT / BIC код",
        routingNumber: "Маршрутный номер (необязательно)",
        bankAddress: "Адрес банка",
        accountType: "Тип счета",
        checking: "Текущий",
        savings: "Сберегательный",
        currency: "Валюта",
        exit: "Выход",
        save: "Сохранить платежные реквизиты",
        saving: "Сохранение...",
        success: "Платежные реквизиты сохранены",
        successDesc: "Ваша платежная информация была успешно обновлена.",
        error: "Ошибка сохранения",
        errorDesc: "Не удалось сохранить платежные реквизиты. Пожалуйста, попробуйте еще раз."
      }
    },
    clientPortal: {
      welcome: "Клиентский портал",
      guest: "Гость",
      subtitle: "Выберите раздел ниже, чтобы начать",
      nav: {
        home: "Главная",
        logTicket: "Создать тикет",
        myTickets: "Мои тикеты",
        services: "Услуги и охват",
        billing: "Биллинг",
        userManagement: "Управление пользователями",
        companyProfile: "Профиль компании",
        help: "Помощь и поддержка",
        quotations: "Коммерческие предложения",
        messages: "Сообщения",
        logout: "Выйти",
        opportunities: "Возможности"
      },
      quotations: {
        title: "Коммерческие предложения",
        subtitle: "Управляйте и отслеживайте сметы проектов",
        searchPlaceholder: "Поиск проектов...",
        requestButton: "Запросить КП",
        loading: "Загрузка предложений...",
        estimatedAmount: "Оценочная сумма",
        status: {
          draft: "Черновик",
          sent: "Отправлено",
          approved: "Одобрено",
          rejected: "Отклонено"
        },
        sendToClient: "Отправить клиенту",
        approve: "Одобрить",
        reject: "Отклонить",
        approveQuote: "Одобрить предложение",
        noQuotations: "Предложения не найдены",
        noQuotationsDesc: "Попробуйте изменить параметры поиска или запросите новое предложение",
        recent: "Недавно",
        unknownClient: "Неизвестный клиент",
        giveQuote: "Дать квоту",
        quoteAmount: "Сумма квоты",
        firstTwoHours: "Первые 2 часа",
        additionalHours: "Доп. часы",
        travelCost: "Транспортные расходы",
        quoteDescription: "Описание квоты",
        submitQuote: "Отправить квоту",
        modal: {
          title: "Запрос коммерческого предложения",
          subtitle: "Расскажите нам о своем проекте, и мы предоставим смету.",
          projectName: "Название проекта",
          projectNamePlaceholder: "например, Настройка офисной сети",
          description: "Описание",
          descriptionPlaceholder: "Опишите объем работ...",
          estimatedBudget: "Оценочный бюджет (необязательно)",
          estimatedBudgetPlaceholder: "например, 5,000",
          submit: "Отправить запрос"
        },
        notifications: {
          requestSentTitle: "Запрос отправлен",
          requestSentMessage: "Ваш запрос на коммерческое предложение успешно отправлен!",
          requestFailedTitle: "Ошибка запроса",
          requestFailedMessage: "Не удалось отправить запрос на коммерческое предложение.",
          statusUpdatedTitle: "Статус обновлен",
          statusUpdatedMessage: "Статус коммерческого предложения обновлен на {status}.",
          updateFailedTitle: "Ошибка обновления",
          updateFailedMessage: "Не удалось обновить статус коммерческого предложения."
        }
      },
      stats: {
        activeTickets: "Активные тикеты",
        activeTicketsDesc: "Текущие открытые запросы",
        teamMembers: "Члены команды",
        teamMembersDesc: "Управляемые аккаунты"
      },
      cards: {
        quickActions: { name: "Быстрые действия", desc: "Доступ к часто используемым функциям и ярлыкам для общих задач" },
        logTicket: { name: "Создать новый тикет", desc: "Создайте и отправьте новый тикет в службу поддержки или запрос на обслуживание" },
        activeTickets: { name: "Активные тикеты", desc: "Просмотр сводки ваших текущих активных и открытых тикетов" },
        awaitingAction: { name: "Ожидание действия", desc: "Тикеты, требующие вашего внимания или одобрения" },
        updates: { name: "Последние обновления и уведомления", desc: "Будьте в курсе всей активности аккаунта и обновлений" },
        startOpportunity: { name: "Начать новую возможность", desc: "Инициировать новый проект или запрос ресурсов" },
        coordinator: { name: "Назначенный координатор Desknet", desc: "Контактная информация и детали вашего выделенного координатора Desknet" },
        accountStatus: { name: "Статус аккаунта", desc: "Обзор статуса вашего аккаунта, биллинга и деталей обслуживания" }
      },
      common: {
        back: "Назад",
        return: "Вернуться к",
        updating: "Обновление контента",
        updatingDesc: "Этот раздел в настоящее время обновляется с использованием последних данных и функций для вашего аккаунта. Пожалуйста, зайдите позже или свяжитесь с поддержкой, если вам нужна немедленная помощь.",
        edit: "Редактировать",
        submit: "Отправить",
        confirm: "Подтвердить",
        cancel: "Отмена",
        loading: "Загрузка...",
        noData: "Данные не найдены",
        viewAll: "Посмотреть все",
        online: "В сети",
        typeMessage: "Введите сообщение...",
        noMessages: "Сообщений пока нет. Начните разговор с поддержкой!"
      },
      logTicket: {
        title: "Создать новый тикет",
        serviceType: "Тип услуги",
        estimatedDuration: "Оценочная длительность",
        priority: "Приоритет",
        subject: "Тема",
        description: "Подробное описание",
        country: "Страна",
        city: "Город",
        location: "Полный адрес",
        contactEmail: "Контактный Email",
        contactPhone: "Контактный телефон",
        specialInstructions: "Специальные инструкции",
        ticketNumber: "Номер тикета",
        dateTime: "Предпочтительная дата/время",
        review: "Проверить тикет",
        edit: "Редактировать тикет",
        confirm: "Подтвердить и отправить",
        submitting: "Отправка...",
        steps: {
          service: "Услуга",
          location: "Локация",
          contact: "Контакт",
          details: "Детали",
          review: "Проверка"
        },
        placeholders: {
          subject: "Краткое описание проблемы",
          description: "Предоставьте как можно больше деталей...",
          location: "Полный адрес объекта",
          estimatedDuration: "например, 4 часа, 2 дня",
          country: "Выберите страну",
          city: "Введите город",
          contactEmail: "contact@example.com",
          contactPhone: "+1 234 567 890",
          specialInstructions: "Любые особые требования к доступу или правила объекта...",
          ticketNumber: "Внутренний номер ссылки"
        },
        options: {
          serviceTypes: {
            onDemand: "Диспетчеризация по требованию",
            project: "Проектная основа",
            maintenance: "Техническое обслуживание",
            hourly: "Почасовая",
            halfDay: "Полдня",
            fullDay: "Полный день"
          },
          priorities: {
            low: "Низкий",
            medium: "Средний",
            high: "Высокий",
            critical: "Критический (SLA)"
          }
        }
      },
      myTickets: {
        title: "Мои тикеты",
        table: {
          id: "ID",
          subject: "Тема",
          status: "Статус",
          engineer: "Инженер",
          date: "Дата",
          priority: "Приоритет",
          type: "Тип",
          actions: "Действия",
          seeMore: "Подробнее"
        },
        filters: {
          all: "Все",
          status: "Статус",
          priority: "Приоритет",
          search: "Поиск тикетов..."
        },
        status: {
          completed: "Завершено",
          resolved: "Решено",
          inProgress: "В процессе",
          onSite: "Инженер на объекте",
          assigned: "Инженер назначен",
          quoteAccepted: "Предложение принято",
          quoted: "Предложение дано",
          approved: "Одобрено",
          rejected: "Отклонено",
          open: "Открыто",
          waitingForConfirmation: "Ожидание подтверждения",
          confirmCompletion: "Подтвердить выполнение",
          rateEngineer: "Как бы вы оценили инженера?",
          ratingSuccess: "Спасибо за ваш отзыв!"
        }
      },
      billing: {
        title: "Биллинг и счета",
        balance: "Текущий баланс",
        pending: "Ожидающие уведомления",
        nextBilling: "Следующая дата выставления счета",
        recentInvoices: "Последние счета"
      },
      subItems: {
        myTickets: {
          list: "Список тикетов",
          filters: "Фильтры",
          timeline: "Хронология статуса тикета",
          quotation: "Видимость котировок и затрат",
          engineer: "Детали назначения инженера",
          comments: "Комментарии и обновления тикетов",
          completion: "Действия по завершению и обратной связи"
        },
        services: {
          catalog: "Каталог услуг",
          models: "Модели взаимодействия",
          coverage: "Охват стран",
          rates: "Стандартные рекомендации по ставкам",
          notes: "Коммерческие примечания"
        },
        billing: {
          advice: "Ежемесячный совет по биллингу",
          approval: "Одобрение совета по биллингу",
          invoices: "Счета",
          history: "История биллинга"
        },
        userManagement: {
          addRemove: "Добавить/Удалить пользователей",
          access: "Контроль доступа"
        },
        opportunities: {
          dispatch: "Выезд по запросу",
          project: "Проектная работа",
          contract: "Контрактная работа",
          fte: "Полная занятость",
          msp: "Управляемые услуги",
          tracking: "Отслеживание возможностей"
        },
        companyProfile: {
          details: "Детали компании",
          contact: "Контактные данные",
          location: "Местоположение",
          billing: "Информация о биллинге",
          operating: "Страны деятельности",
          industry: "Отрасль"
        },
        help: {
          howItWorks: "Как это работает",
          faqs: "Часто задаваемые вопросы",
          contact: "Контактные данные службы поддержки",
          country: "Поддержка по странам",
          city: "Поддержка по городам",
          guidelines: "Рекомендации по порталу",
          mapTimeZones: "Карта и часовые пояса",
          dispatcherTools: "Инструменты диспетчера",
          trucks: "Транспорт"
        }
      },
      services: {
        title: "Услуги и охват",
        itManagement: { title: "IT-менеджмент и развертывание", price: "Индивидуальный расчет", desc: "Мы управляем вашими ИТ-системами от начала до конца — включая настройку, обновление и перенос вашей инфраструктуры или программного обеспечения — чтобы ваш бизнес работал без перебоев." },
        infrastructure: { title: "Создание и настройка инфраструктуры", price: "Индивидуальный расчет", desc: "FIXORE IT Global проектирует, создает и совершенствует ИТ-системы в соответствии с вашими целями, обеспечивая высокую производительность, легкий рост и полное соответствие всем стандартам." },
        support: { title: "Поддержка конечных пользователей и сети", price: "Индивидуальный расчет", desc: "Многоуровневая ИТ-поддержка предоставляется через выездные, удаленные и сетевые услуги, обеспечивая быстрое реагирование и надежную работу для любого бизнеса." },
        maintenance: { title: "Техническое обслуживание и услуги IMAC", price: "Индивидуальный расчет", desc: "Услуги по ремонту и полному IMAC (установка, перемещение, добавление, изменение), которые обеспечивают бесперебойную повседневную работу ИТ и максимально сокращают время простоя." },
        asset: { title: "Жизненный цикл активов и переработка", price: "Индивидуальный расчет", desc: "Безопасное и ответственное управление ИТ-активами, которое охватывает удаление, повторное использование, утилизацию и перепродажу — с соблюдением строгих стандартов безопасности данных и экологических стандартов." },
        coverage: {
          title: "Глобальный охват",
          desc: "Мы предоставляем услуги в 94+ странах с сетью из 20 000+ сертифицированных инженеров.",
          cta: "Посмотреть карту охвата"
        }
      },
      userManagement: {
        title: "Управление пользователями",
        addUser: "Добавить пользователя",
        noUsers: "Субпользователи не найдены. Добавьте своего первого члена команды!"
      },
      companyProfile: {
        title: "Профиль компании",
        memberSince: "Участник с",
        generalInfo: "Общая информация",
        industry: "Отрасль",
        employees: "Сотрудники",
        website: "Веб-сайт",
        contactDetails: "Контактные данные",
        primaryAddress: "Основной адрес",
        country: "Страна",
        city: "Город",
        location: "Полное местоположение",
        description: "Описание компании",
        taxId: "ИНН / НДС",
        yearFounded: "Год основания",
        linkedin: "Профиль LinkedIn",
        primaryContact: "Основное контактное лицо"
      },
      help: {
        title: "Помощь и поддержка",
        faqs: "Часто задаваемые вопросы",
        faqItems: [
          { q: 'Каков SLA для критических заявок?', a: 'Для критических заявок гарантируется время реагирования на месте в течение 4 часов.' },
          { q: 'Как проверяются инженеры?', a: 'Все инженеры проходят техническую оценку и проверку биографических данных.' },
          { q: 'Могу ли я отменить запланированный выезд?', a: 'Да, но при отмене менее чем за 24 часа может взиматься плата.' }
        ],
        howItWorksItems: [
          { step: '01', title: 'Создать заявку', desc: 'Отправьте свой запрос через портал.' },
          { step: '02', title: 'Назначение', desc: 'Мы подберем проверенного инженера.' },
          { step: '03', title: 'Выполнение', desc: 'Инженер выполняет работу на месте.' },
          { step: '04', title: 'Завершение', desc: 'Проверьте и подтвердите выполнение услуги.' }
        ],
        immediateHelp: "Нужна немедленная помощь?",
        supportCenter: "Глобальный центр поддержки",
        accountManager: "Менеджер по работе с клиентами",
        managerName: "Алекс Томпсон",
        managerRole: "Персональный менеджер по успеху",
        supportDesc: "Наша служба поддержки доступна 24/7, чтобы помочь вам с любыми техническими проблемами.",
        liveChat: "Живой чат",
        waitTime: "Среднее время ожидания: 2 мин",
        startChat: "Начать чат"
      },
      messages: {
        title: "Сообщения",
        conversations: "Разговоры",
        activeChat: "Активный чат поддержки"
      },
      addUser: {
        title: "Добавить нового пользователя",
        username: "Имя пользователя",
        usernamePlaceholder: "Введите имя пользователя",
        email: "Адрес электронной почты",
        emailPlaceholder: "user@company.com",
        role: "Роль",
        roles: {
          admin: "Админ",
          manager: "Менеджер",
          viewer: "Зритель"
        },
        submit: "Создать пользователя"
      }
    },
    settings: {
      title: "Настройки",
      profile: "Профиль",
      security: "Безопасность",
      notifications: "Уведомления",
      preferences: "Предпочтения",
      profileInfo: "Информация о профиле",
      profileDesc: "Обновите свои личные данные и то, как вас видят другие на платформе.",
      fullName: "Полное имя",
      email: "Адрес электронной почты",
      phone: "Номер телефона",
      saveChanges: "Сохранить изменения",
      securitySettings: "Настройки безопасности",
      securityDesc: "Управляйте своим паролем и настройками безопасности аккаунта.",
      passwordReq: "Требования к паролю",
      passwordReqDesc: "Для обеспечения безопасности вашего аккаунта пароли должны содержать не менее 8 символов и включать сочетание букв, цифр и символов.",
      newPassword: "Новый пароль",
      confirmPassword: "Подтвердите новый пароль",
      updatePassword: "Обновить пароль",
      notifPrefs: "Настройки уведомлений",
      notifDesc: "Управляйте тем, как и когда вы получаете обновления от платформы Desknet.",
      emailNotif: "Уведомления по электронной почте",
      emailNotifDesc: "Получайте обновления о тикетах, работах и счетах по электронной почте.",
      pushNotif: "Push-уведомления",
      pushNotifDesc: "Получайте оповещения в режиме реального времени в браузере или на мобильном устройстве.",
      smsNotif: "SMS-оповещения",
      smsNotifDesc: "Получайте критические системные оповещения через текстовые сообщения.",
      marketingNotif: "Маркетинговые обновления",
      marketingNotifDesc: "Будьте в курсе новых функций и улучшений платформы.",
      saveNotif: "Сохранить настройки уведомлений",
      platformPrefs: "Предпочтения платформы",
      platformDesc: "Настройте интерфейс и параметры локализации.",
      language: "Язык",
      appearance: "Внешний вид",
      light: "Светлая",
      dark: "Темная",
      timezone: "Часовой пояс",
      savePrefs: "Сохранить предпочтения",
      dangerZone: "Опасная зона",
      deleteAccount: "Удалить аккаунт",
      deleteDesc: "Навсегда удалите свой аккаунт и все связанные с ним данные. Это действие нельзя отменить.",
      deleteConfirmTitle: "Вы абсолютно уверены?",
      deleteConfirmDesc: "Это действие является постоянным и не может быть отменено. Все ваши данные, тикеты и сообщения будут потеряны навсегда.",
      deleteConfirmButton: "Да, удалить мой аккаунт",
      cancel: "Отмена",
      successProfile: "Профиль успешно обновлен!",
      errorProfile: "Не удалось обновить профиль. Пожалуйста, попробуйте еще раз.",
      successPassword: "Пароль успешно обновлен!",
      errorPassword: "Не удалось обновить пароль.",
      successNotif: "Настройки уведомлений сохранены!",
      errorNotif: "Не удалось сохранить уведомления.",
      successPrefs: "Предпочтения платформы обновлены!",
      errorPrefs: "Не удалось обновить предпочтения.",
      errorDelete: "Не удалось удалить аккаунт."
    },
    messaging: {
      translate: "Перевести сообщение",
      translated: "Переведено",
      showOriginal: "Показать оригинал"
    },
    aiChat: {
      title: "GEN-AI Помощник",
      placeholder: "Спросите что угодно о наших услугах...",
      welcome: "Добро пожаловать в будущее инженерии. Я GEN-AI, ваш помощник с продвинутым интеллектом. Как я могу оптимизировать вашу работу сегодня?",
      error: "Извините, произошла ошибка. Пожалуйста, попробуйте еще раз.",
      clear: "Очистить чат",
      close: "Закрыть панель"
    }
  },
  uz: {
    nav: {
      home: "Bosh sahifa",
      signUp: "Ro'yxatdan o'tish",
      platform: "Platforma",
      solutions: "Yechimlar",
      pricing: "Narxlar",
      resources: "Resurslar",
      login: "Kirish",
      contact: "Aloqa",
      getStarted: "Boshlash"
    },
    ticket: {
      tag: "Qo'llab-quvvatlash",
      title: "Chipta",
      titleAccent: "Yaratish",
      subtitle: "Yordam kerakmi? Bizning qo'llab-quvvatlash jamoamiz har qanday texnik yoki hisob bilan bog'liq muammolarda yordam berishga tayyor.",
      steps: {
        category: "Toifa",
        details: "Tafsilotlar",
        priority: "Ustuvorlik",
        review: "Ko'rib chiqish"
      },
      fields: {
        type: "Muammo turi",
        subject: "Mavzu",
        description: "Tavsif",
        urgency: "Shoshilinchlik",
        impact: "Ta'sir"
      },
      placeholders: {
        subject: "Muammoni qisqacha tasvirlab bering",
        description: "Iloji boricha ko'proq tafsilotlarni taqdim eting..."
      },
      submit: "Chiptani yuborish",
      success: "Chipta muvaffaqiyatli yuborildi",
      successDesc: "Bizning jamoamiz so'rovingizni ko'rib chiqadi va tez orada siz bilan bog'lanadi."
    },
    hero: {
      title: "Dunyo bo'ylab eng yaxshi",
      titleAccent: "IT iste'dodlarini toping",
      subtitle: "94+ ta mamlakatdan kelgan tasdiqlangan muhandislar bilan bog'laning. Orzuingizdagi jamoani oylar emas, kunlar ichida quring.",
      ctaPrimary: "Ishga olishni boshlash",
      ctaSecondary: "Demoni ko'rish"
    },
    trusted: "Sohaning yetakchi kompaniyalari ishonadi",
    stats: {
      tag: "Raqamlarda",
      title: "Korporativ",
      titleAccent: "miqyosdagi quvvat",
      subtitle: "IT iste'dodlariga bo'lgan ehtiyojlarini qondirish uchun Desknet-ga ishonadigan dunyodagi eng tez rivojlanayotgan kompaniyalarga qo'shiling",
      verified: "Tasdiqlangan muhandislar",
      verifiedSub: "Ishga tayyor mutaxassislar",
      partners: "Hamkor kompaniyalar",
      partnersSub: "Ishonchli hamkorlar",
      matchTime: "o'rtacha tanlash vaqti",
      matchTimeSub: "Sun'iy intellekt asosida tezkor tanlash",
      satisfaction: "Mijozlar mamnuniyati",
      satisfactionSub: "Mijozlar baxtiyorligi ko'rsatkichi"
    },
    metrics: {
      matchTime: "Birinchi moslikkacha bo'lgan vaqt",
      industryAvg: "soha o'rtacha ko'rsatkichiga nisbatan",
      faster: "6 baravar tezroq",
      tag: "Haqiqiy natijalar",
      title: "Muhim",
      titleAccent: "ko'rsatkichlar",
      subtitle: "Mijozlarimiz birinchi kundan boshlab ishga olish tezligi, xarajatlar samaradorligi va iste'dodlar sifatining sezilarli darajada yaxshilanishini ko'rmoqdalar.",
      reduction: "Ishga olish xarajatlarini kamaytirish",
      productivity: "Mahsuldorlikka tezroq erishish",
      renewal: "Shartnomani uzaytirishning o'rtacha ko'rsatkichi"
    },
    capabilities: {
      tag: "Platforma imkoniyatlari",
      title: "Korporativ",
      titleAccent: "miqyos uchun qurilgan",
      subtitle: "Dunyoning eng talabchan tashkilotlari uchun qurilgan keng qamrovli platforma.",
      ai: "Sun'iy intellekt asosida tanlash",
      aiDesc: "Bizning xususiy algoritmimiz sizning talablaringizga 48 soat ichida mos keladigan iste'dodlarni topadi.",
      security: "Korporativ xavfsizlik",
      securityDesc: "SOC 2 Type II sertifikati. Bank darajasidagi shifrlash. GDPR, HIPAA va boshqalarga to'liq muvofiqlik.",
      network: "Global iste'dodlar tarmog'i",
      networkDesc: "94+ ta mamlakatdagi tasdiqlangan muhandislarga kirish, barcha vaqt zonalari qamrab olingan, 24/7 qo'llab-quvvatlash.",
      modular: "Modulli platforma",
      modularDesc: "O'zingizga kerakli xizmatlarni tanlang. Talabga qarab darhol kengaytiring yoki qisqartiring."
    },
    cta: {
      title: "IT ishga olish jarayonini",
      titleAccent: "o'zgartirishga tayyormisiz?",
      subtitle: "Dunyo darajasidagi muhandislik jamoalarini qurish uchun Desknet-dan foydalanadigan 35+ kompaniyaga qo'shiling. Oylar emas, bir necha daqiqada boshlang.",
      primary: "Bepul sinovni boshlash",
      secondary: "Sotuv bo'limi bilan bog'lanish"
    },
    footer: {
      desc: "Korporativ darajadagi IT iste'dodlarini topish va boshqarish uchun global platforma.",
      product: "Mahsulot",
      company: "Kompaniya",
      legal: "Huquqiy",
      rights: "Barcha huquqlar himoyalangan.",
      links: {
        features: "Imkoniyatlar",
        postJob: "Ish joylashtirish",
        findEngineers: "Muhandislarni topish",
        getStarted: "Boshlash",
        security: "Xavfsizlik",
        aboutUs: "Biz haqimizda",
        careers: "Karyera",
        contact: "Aloqa"
      },
      tagline: "Dunyoning eng yaxshi IT iste'dodlar tarmog'ini yaratish"
    },
    contact: {
      tag: "Biz bilan bog'laning",
      title: "Keling,",
      titleAccent: "kelajakni",
      titleSuffix: "birgalikda quramiz",
      subtitle: "Platformamiz haqida savollaringiz bormi yoki maxsus yechim kerakmi? Bizning jamoamiz muhandislik operatsiyalaringizni global miqyosda kengaytirishga yordam berishga tayyor.",
      form: {
        name: "To'liq ism",
        email: "Elektron pochta",
        subject: "Mavzu",
        message: "Xabar",
        submit: "Xabarni yuborish",
        sending: "Yuborilmoqda...",
        success: "Xabar yuborildi!",
        successDesc: "Bog'langaningiz uchun tashakkur. Bizning jamoamiz xabaringizni ko'rib chiqadi va 24 soat ichida siz bilan bog'lanadi.",
        sendAnother: "Yana bir xabar yuborish"
      },
      info: {
        phone: { title: "Bizga qo'ng'iroq qiling", details: "+1 (888) DESKNET", sub: "Dush-Jum 8:00 dan 18:00 gacha" },
        email: { title: "Bizga yozing", details: "hello@desknet.io", sub: "Onlayn qo'llab-quvvatlash 24/7" },
        address: { title: "Bizga tashrif buyuring", details: "100 Tech Plaza, Suite 500", sub: "San-Fransisko, CA 94105" }
      }
    },
    about: {
      tag: "Biz haqimizda",
      heroTitle: "Ajoyib IT iste'dodlarini innovatsion kompaniyalar bilan bog'laymiz",
      heroDesc: "Desknet — global texnik iste'dodlar uchun infratuzilma qatlamidir. Biz eng yaxshi muhandislar va istiqbolli kompaniyalar o'rtasidagi tafovutni bartaraf etamiz.",
      missionTag: "Bizning missiyamiz",
      missionTitle: "Kompaniyalar iste'dodlarni topish va muhandislar imkoniyatlarni topish usulini o'zgartirish",
      missionDesc: "Desknet — global texnik iste'dodlar uchun infratuzilma qatlamidir. Biz eng yaxshi muhandislar va istiqbolli kompaniyalar o'rtasidagi tafovutni bartaraf etamiz.",
      rigorousVetting: "Qattiq tekshiruv",
      valuesTag: "Asosiy qadriyatlar",
      valuesTitle: "Bizni nima oldinga undaydi",
      valuesSubtitle: "Bizning asosiy tamoyillarimiz har bir qaror va har bir funksiyani boshqaradi.",
      values: {
        transparency: {
          title: "Shaffoflik",
          desc: "Barcha tomonlar uchun halol muloqot va aniq shartlar. Yashirin to'lovlar yo'q, syurprizlar yo'q — faqat to'g'ridan-to'g'ri hamkorlik."
        },
        quality: {
          title: "Birinchi navbatda sifat",
          desc: "Biz faqat tasdiqlangan muhandislar va mukammallikka intiladigan jiddiy kompaniyalar bilan ishlaymiz."
        },
        compensation: {
          title: "Adolatli haq to'lash",
          desc: "Muhandislar raqobatbardosh stavkalarga loyiqdir. Biz har bir imkoniyat texnik tajribani qadrlashini ta'minlaymiz."
        },
        speed: {
          title: "Tezlik va samaradorlik",
          desc: "Texnologiyada vaqt muhim. Bizning jarayonimiz iste'dodlarni oylar emas, kunlar ichida imkoniyatlar bilan bog'laydi."
        },
        community: {
          title: "Jamiyatga yo'naltirilgan",
          desc: "Biz shunchaki platforma qurmayapmiz — biz texnologlar va innovatorlar hamjamiyatini yaratyapmiz."
        },
        innovation: {
          title: "Doimiy innovatsiyalar",
          desc: "Texnologiya rivojlanmoqda va biz u bilan birga rivojlanmoqdamiz. Biz platformani doimiy ravishda takomillashtirib boramiz."
        }
      },
      howItWorksTitle: "Desknet qanday ishlaydi",
      howItWorksSubtitle: "Ham muhandislar, ham kompaniyalar uchun foydali bo'lgan soddalashtirilgan jarayon.",
      forEngineers: "Muhandislar uchun",
      forCompanies: "Kompaniyalar uchun",
      steps: {
        engineers: [
          { title: "Profilingizni yarating", desc: "O'z mahoratingizni, tajribangizni va kutilayotgan stavkangizni bir necha daqiqada namoyish eting." },
          { title: "Tasdiqlashdan o'ting", desc: "Bizning jamoamiz sifatli moslikni ta'minlash uchun profilingizni tekshiradi." },
          { title: "Kompaniyalar bilan bog'laning", desc: "Sizning mahoratingiz va afzalliklaringizga mos keladigan imkoniyatlarni oling." }
        ],
        companies: [
          { title: "Talablaringizni joylashtiring", desc: "Sizga kerak bo'lgan mahorat, tajriba va loyiha tafsilotlarini belgilang." },
          { title: "Mos keladigan muhandislarni ko'rib chiqing", desc: "Sizning mezonlaringizga to'liq mos keladigan tasdiqlangan muhandislarni ko'rib chiqing." },
          { title: "Qurishni boshlang", desc: "To'g'ridan-to'g'ri bog'laning va yangi jamoa a'zosi bilan ishlashni boshlang." }
        ]
      },
      ctaTitle: "Tarmoqqa qo'shilishga tayyormisiz?",
      ctaSubtitle: "Bugun sayohatingizni boshlang va eng yaxshi texnik mutaxassislar va kompaniyalar bilan bog'laning.",
      getStarted: "Boshlash",
      learnMore: "Batafsil ma'lumot"
    },
    testimonials: {
      tag: "Fikr-mulohazalar",
      title: "Eng yaxshilar",
      titleAccent: "ishonadi",
      subtitle: "Desknet bilan kelajakni qurayotgan muhandislik rahbarlari va dasturchilarning fikrlarini tinglang.",
      items: [
        {
          quote: "Desknet bizning ishga olish jarayonimizni butunlay o'zgartirdi. Biz 48 soat ichida infratuzilmamiz uchun muhim bo'lgan Senior Arxitektorni topdik.",
          author: "James Wilson",
          role: "TechFlow CTOsi",
          avatar: "https://picsum.photos/seed/james/100/100"
        },
        {
          quote: "Muhandis sifatida Desknet menga adolatli haq to'lash va to'liq shaffoflik bilan dunyo darajasidagi loyihalarda ishlash erkinligini beradi. Bu men kutgan platforma.",
          author: "Elena Rodriguez",
          role: "Senior Full Stack Engineer",
          avatar: "https://picsum.photos/seed/elena/100/100"
        },
        {
          quote: "Desknet-dagii iste'dodlar sifati tengsizdir. Ularning tekshirish jarayoni qat'iy bo'lib, bizga faqat dunyo iste'dodlarining eng yaxshi 1 foizi bilan suhbatlashishni ta'minlaydi.",
          author: "Marcus Chen",
          role: "CloudScale muhandislik bo'yicha vitse-prezidenti",
          avatar: "https://picsum.photos/seed/marcus/100/100"
        }
      ]
    },
    login: {
      title: "Xush kelibsiz",
      subtitle: "Davom etish uchun hisob turini tanlang",
      engineer: "Muhandis",
      engineerDesc: "Keyingi katta imkoniyatingizni toping",
      client: "Mijoz",
      clientDesc: "Dunyo darajasidagi muhandislik iste'dodlarini yollang",
      admin: "Administrator",
      adminDesc: "Desknet platformasini boshqarish",
      email: "Elektron pochta manzili",
      password: "Parol",
      signIn: "Kirish",
      signInAsAdmin: "Admin sifatida kirish",
      signInAsEngineer: "Muhandis sifatida kirish",
      signInAsClient: "Mijoz sifatida kirish",
      forgotPassword: "Parolni unutdingizmi?",
      noAccount: "Hisobingiz yo'qmi?",
      signUp: "Ro'yxatdan o'tish",
      back: "Tanlovga qaytish"
    },
    signup: {
      title: "Desknet-ga qo'shiling",
      subtitle: "Boshlash uchun hisob turini tanlang",
      engineer: "Muhandis",
      engineerDesc: "Bizning elita muhandislar tarmog'imizga qo'shiling",
      client: "Mijoz",
      clientDesc: "Tasdiqlangan muhandislik iste'dodlarini yollang",
      fullName: "To'liq ism",
      email: "Elektron pochta manzili",
      password: "Parol",
      companyName: "Kompaniya nomi",
      firstName: "Ism",
      lastName: "Familiya",
      companyEmail: "Kompaniya emaili",
      companySize: "Kompaniyadagi xodimlar soni",
      createAccount: "Hisob yaratish",
      hasAccount: "Hisobingiz bormi?",
      signIn: "Kirish",
      back: "Tanlovga qaytish",
      continue: "Davom etish",
      complete: "Ro'yxatdan o'tishni yakunlash",
      steps: {
        account: "Hisob",
        personal: "Shaxsiy",
        professional: "Tajriba",
        rates: "Stavkalar",
        assets: "Fayllar"
      },
      fields: {
        dob: "Tug'ilgan sana",
        day: "Kun",
        month: "Oy",
        year: "Yil",
        country: "Mamlakat",
        city: "Shahar",
        zipCode: "Pochta indeksi (ixtiyoriy)",
        specialization: "Asosiy IT mutaxassisligi",
        experience: "Tajriba yillari",
        skills: "Ko'nikmalar (vergul bilan)",
        hourlyRate: "Soatlik stavka ($)",
        halfDayRate: "Yarim kunlik stavka ($)",
        fullDayRate: "To'liq kunlik stavka ($)",
        languages: "Tillar",
        contactInfo: "Aloqa ma'lumotlari",
        phoneNumber: "Telefon raqami",
        whatsappNumber: "WhatsApp raqami",
        linkedin: "LinkedIn foydalanuvchi nomi (ixtiyoriy)",
        facebook: "Facebook foydalanuvchi nomi (ixtiyoriy)",
        cvUpload: "CV yuklash (PDF)",
        idUpload: "ID yuklash (JPG/PNG/PDF)",
        profilePic: "Profil rasmi"
      },
      onboarding: {
        step1: { title: "Tug'ilgan sana", desc: "Iltimos, tug'ilgan sanangizni ko'rsating." },
        step2: { title: "Manzil", desc: "Hozirda qayerda istiqomat qilasiz?" },
        step3: { title: "Mutaxassislik", desc: "Sizning asosiy texnik tajribangiz qaysi sohada?" },
        step4: { title: "Ish tajribasi", desc: "Ushbu sohada necha yildan beri ishlayapsiz?" },
        step5: { title: "Ko'nikmalar", desc: "Asosiy texnik ko'nikmalaringiz va asboblaringizni sanab o'ting." },
        step6: { title: "Stavkalar", desc: "Turli xil hamkorlik turlari uchun kutilayotgan stavkalaringizni belgilang." },
        step7: { title: "Tillar", desc: "Qaysi tillarda gaplashasiz va qaysi darajada?" },
        step8: { title: "Aloqa ma'lumotlari", desc: "Kompaniyalar siz bilan qanday bog'lanishlari mumkin?" },
        step9: { title: "CV va ID yuklash", desc: "Oxirgi CV va ID nusxasini yuklang." },
        step10: { title: "Profil rasmi", desc: "Profilingizga professional fotosurat qo'shing." },
        proficiencyLevels: {
          a1: "A1 - Boshlang'ich",
          a2: "A2 - Oddiy",
          b1: "B1 - O'rta",
          b2: "B2 - O'rtadan yuqori",
          c1: "C1 - Ilg'or",
          c2: "C2 - Mukammal",
          native: "Ona tili"
        },
        placeholders: {
          searchCountry: "Mamlakatni qidirish...",
          searchCity: "Shaharni qidirish...",
          zipCode: "Pochta indeksini kiriting",
          selectCountryFirst: "Avval mamlakatni tanlang",
          selectSpecializations: "Mutaxassisliklarni tanlang...",
          searchSkills: "Ko'nikmalarni qidirish va qo'shish...",
          usdPerHour: "Soatiga USD",
          usdHalfDay: "4 soat uchun USD",
          usdFullDay: "8 soat uchun USD",
          selectLanguage: "Tilni tanlang",
          selectLevel: "Daraja",
          phoneNumber: "Telefon raqami",
          whatsappNumber: "WhatsApp raqami",
          linkedin: "m-n: johndoe",
          facebook: "m-n: johndoe",
          uploadCV: "CV-ni yuklang",
          uploadID: "ID-ni yuklang",
          cvFormat: "PDF formatida bo'lishi tavsiya etiladi, maks 5MB",
          idFormat: "JPG, PNG yoki PDF, maks 5MB",
          confirmCV: "CV-ni tasdiqlash",
          confirmID: "ID-ni tasdiqlash",
          cvConfirmed: "CV tasdiqlandi",
          idConfirmed: "ID tasdiqlandi",
          yearsExperience: "Ish tajribasi yillari",
          countryCode: "Kod",
          profilePicTitle: "Profil rasmi",
          profilePicDesc: "Kompaniyalar sizni tanib olishiga yordam bering. Kvadrat rasmlar eng yaxshi natija beradi.",
          choosePhoto: "Rasmni tanlash",
          confirmPhoto: "Rasmni tasdiqlash",
          photoConfirmed: "Rasm tasdiqlandi",
          change: "O'zgartirish",
          cancel: "Bekor qilish",
          back: "Orqaga",
          completeReg: "Ro'yxatdan o'tishni yakunlash",
          continue: "Davom etish"
        }
      }
    },
    legal: {
      terms: {
        title: "Xizmat ko'rsatish shartlari",
        lastUpdated: "Oxirgi yangilanish: Oktyabr 2023",
        content: `Desknet-ga xush kelibsiz. Bizning platformamizdan foydalanish orqali siz quyidagi shartlarga rozilik bildirasiz:

1. Shartlarni qabul qilish: Desknet-ga kirish yoki undan foydalanish orqali siz ushbu Xizmat ko'rsatish shartlari va barcha amaldagi qonunlar va qoidalarga rioya qilishga rozilik bildirasiz.

2. Foydalanuvchi hisoblari: Siz hisobingiz va parolingiz maxfiyligini saqlash uchun javobgarsiz. Siz hisobingiz ostida sodir bo'ladigan barcha harakatlar uchun javobgarlikni o'z zimmangizga olishga rozilik bildirasiz.

3. Platformadan foydalanish: Desknet IT iste'dodlarini kompaniyalar bilan bog'lash uchun maydon taqdim etadi. Biz ishga joylashish yoki loyiha muvaffaqiyatini kafolatlamaymiz.

4. Intellektual mulk: Ushbu platformadagi barcha tarkib Desknet yoki uning yetkazib beruvchilarining mulki hisoblanadi va xalqaro mualliflik huquqi qonunlari bilan himoyalangan.

5. Javobgarlikni cheklash: Desknet xizmatdan foydalanishingiz natijasida kelib chiqadigan har qanday bilvosita, tasodifiy, maxsus yoki jazo choralariga tortiladigan zararlar uchun javobgar bo'lmaydi.

6. O'zgartirishlar: Biz ushbu shartlarni istalgan vaqtda o'zgartirish huquqini saqlab qolamiz. Platformadan foydalanishni davom ettirish yangi shartlarni qabul qilishni anglatadi.`
      },
      privacy: {
        title: "Maxfiylik siyosati",
        lastUpdated: "Oxirgi yangilanish: Oktyabr 2023",
        content: `Sizning maxfiyligingiz biz uchun muhim. Ushbu siyosat biz sizning shaxsiy ma'lumotlaringizni qanday to'plashimiz, foydalanishimiz va himoya qilishimizni tushuntiradi:

1. Ma'lumotlarni to'plash: Biz siz to'g'ridan-to'g'ri taqdim etgan ma'lumotlarni to'playmiz, masalan, hisob yaratganingizda, profilingizni yangilaganingizda yoki biz bilan bog'langaningizda.

2. Ma'lumotlardan foydalanish: Biz sizning ma'lumotlaringizdan xizmatlarimizni taqdim etish, saqlash va yaxshilash, tranzaksiyalarni amalga oshirish hamda sizga texnik bildirishnomalar va qo'llab-quvvatlash xabarlarini yuborish uchun foydalanamiz.

3. Ma'lumotlarni almashish: Biz sizning ma'lumotlaringizni platformaning asosiy funksionalligi doirasida potentsial ish beruvchilar yoki mijozlar bilan baham ko'rishimiz mumkin. Biz sizning shaxsiy ma'lumotlaringizni uchinchi shaxslarga sotmaymiz.

4. Ma'lumotlar xavfsizligi: Biz sizning shaxsiy ma'lumotlaringizni ruxsiz kirish, oshkor qilish yoki yo'q qilishdan himoya qilish uchun oqilona xavfsizlik choralarini ko'ramiz.

5. Cookie-fayllar: Biz sizning tajribangizni yaxshilash va platformamizga tashrif buyuruvchilar haqida ma'lumot to'plash uchun cookie-fayllardan foydalanamiz.

6. Sizning huquqlaringiz: Siz istalgan vaqtda hisob sozlamalari orqali shaxsiy ma'lumotlaringizga kirish, ularni tuzatish yoki o'chirish huquqiga egasiz.`
      },
      cookies: {
        title: "Cookie siyosati",
        lastUpdated: "Oxirgi yangilanish: Oktyabr 2023",
        content: "Biz platformamizdagi tajribangizni yaxshilash uchun cookie-fayllardan foydalanamiz. Desknet-dan foydalanish orqali siz Maxfiylik siyosatimizga muvofiq cookie-fayllardan foydalanishimizga rozilik bildirasiz."
      },
      agreeText: "Men",
      andText: "va",
      agreeSuffix: "ga roziman"
    },
    why: {
      tag: "Nima uchun Desknet",
      heroTitle: "Nima uchun",
      heroTitleAccent: "Desknet?",
      heroSubtitle: "Ajoyib muhandislik jamoalarini qurish uchun kerak bo'lgan hamma narsa",
      stats: {
        engineers: "Tasdiqlangan muhandislar",
        countries: "Mamlakatlar",
        success: "Muvaffaqiyat darajasi"
      },
      watchDemo: "Qanday ishlashini ko'ring",
      benefitsTag: "afzalliklar",
      benefitsTitle: "Muvaffaqiyatga erishish uchun",
      benefitsTitleAccent: "kerak bo'lgan hamma narsa",
      benefitsSubtitle: "Muhandislar va kompaniyalar uchun mo'ljallangan keng qamrovli xususiyatlar",
      benefits: [
        { title: "Tasdiqlangan iste'dodlar bazasi", desc: "Platformamizdagi har bir muhandis diqqat bilan tekshiriladi va tasdiqlanadi." },
        { title: "Adolatli haq to'lash", desc: "Muhandislar o'z stavkalarini to'liq shaffoflik bilan belgilaydilar." },
        { title: "Xavfsiz to'lovlar", desc: "Bizning eskrou tizimimiz har ikki tomonni ham himoya qiladi." },
        { title: "24/7 qo'llab-quvvatlash", desc: "Bizning maxsus qo'llab-quvvatlash jamoamiz har doim mavjud." },
        { title: "Tezkor moslashtirish", desc: "Bizning aqlli algoritmimiz sizni tezda bog'laydi." },
        { title: "Global tarmoq", desc: "Dunyo bo'ylab iste'dodlarga kiring." }
      ],
      verificationTag: "Tekshirish jarayoni",
      verificationTitle: "Har bir muhandis,",
      verificationTitleAccent: "To'liq tekshirilgan",
      verificationSubtitle: "Bizning qat'iy tekshirish jarayonimiz sizning faqat yuqori darajadagi mutaxassislar bilan ishlashingizni ta'minlaydi. Biografiyani tekshirish, ko'nikmalarni baholash va real vaqtda tekshirish.",
      verificationList: [
        "Texnik ko'nikmalarni baholash",
        "Biografiyani tekshirish",
        "Portfelni ko'rib chiqish"
      ],
      comparisonTag: "Taqqoslash",
      comparisonTitle: "Desknet va",
      comparisonTitleAccent: "boshqalar",
      comparisonSubtitle: "Nima uchun yetakchi kompaniyalar an'anaviy platformalardan ko'ra Desknet-ni tanlashini bilib oling",
      comparison: {
        header: ["Xususiyat", "Desknet", "Boshqalar"],
        rows: [
          ["Iste'dodlarni tekshirish", "Check", "Cheklangan"],
          ["Shaffof narxlar", "Check", "Yashirin to'lovlar"],
          ["Eskrou himoyasi", "Check", "Farq qiladi"],
          ["AI asosida moslashtirish", "Check", "Qo'lda"],
          ["Global qamrov", "94+ ta Mamlakatlar", "Mintaqaviy"],
          ["Yordam javobi", "< 2 soat", "24-48 soat"]
        ]
      },
      networkTitle: "Haqiqatdan ham",
      networkTitleAccent: "Global tarmoq",
      networkSubtitle: "Barcha asosiy texnologik steklar bo'yicha tajribaga ega 94+ ta mamlakatdan yuqori darajadagi IT iste'dodlariga kiring.",
      networkStats: [
        { label: "Muhandislar", value: "3,500+" },
        { label: "Kompaniyalar", value: "35+" },
        { label: "Mamlakatlar", value: "94+" },
        { label: "Uptime", value: "99.9%" }
      ],
      networkLive: "Jonli muhandislar",
      networkProjects: "Faol loyihalar",
      ctaTitle: "O'zgarish qilishga tayyormisiz?",
      ctaSubtitle: "Bugun Desknet-da minglab muvaffaqiyatli muhandislar va kompaniyalarga qo'shiling.",
      ctaEarning: "Daromad olishni boshlang",
      ctaHiring: "Ishga olishni boshlang",
      ctaBadges: ["SOC 2 sertifikatlangan", "Yashirin to'lovlar yo'q", "24/7 qo'llab-quvvatlash"],
      verificationCards: {
        technical: "Texnik ko'nikmalar",
        verified: "Tasdiqlangan",
        background: "Biografiyani tekshirish",
        passed: "O'tdi",
        identity: "Shaxsni tasdiqlash",
        confirmed: "Tasdiqlandi"
      }
    },
    portal: {
      menu: {
        dashboard: "Boshqaruv paneli",
        profile: "Mening profilim",
        bankAccountDetails: "Bank hisob tafsilotlari",
        tickets: "Mening chiptalarim",
        findJobs: "Ish qidirish",
        messages: "Xabarlar",
        settings: "Sozlamalar",
        logout: "Chiqish"
      },
      dashboard: {
        title: "Muhandis boshqaruv paneli",
        welcomeBack: "Xush kelibsiz",
        assignedTickets: "Tayinlangan tiketlar",
        rating: "Reyting",
        activeTasks: "Faol vazifalar",
        viewAll: "Barchasini ko'rish",
        liveActivity: "Jonli faoliyat",
        networkStatus: "Tarmoq holati",
        status: "Holat",
        optimal: "Optimal"
      },
      profile: {
        verified: "Tasdiqlangan Pro",
        verifiedEngineer: "Tasdiqlangan muhandis",
        edit: "Profilni tahrirlash",
        stats: {
          rate: "Soatlik stavka",
          halfDayRate: "Yarim kunlik stavka",
          fullDayRate: "To'liq kunlik stavka",
          experience: "Tajriba",
          success: "Muvaffaqiyat darajasi"
        },
        skills: "Texnik ko'nikmalar",
        languages: "Tillar",
        contactInfo: "Aloqa ma'lumotlari"
      },
      jobs: {
        searchPlaceholder: "Ishlar, ko'nikmalar yoki kompaniyalarni qidirish...",
        searchBtn: "Ish qidirish",
        apply: "Hozir topshirish",
        remote: "Masofaviy",
        posted: "Joylashtirilgan"
      },
      messages: {
        recent: "So'nggi suhbatlar",
        searchPlaceholder: "Xabarlarni qidirish...",
        empty: "Xabar yuborish uchun suhbatni tanlang"
      },
      settings: {
        account: "Hisob sozlamalari",
        notifications: "Email xabarnomalari",
        notificationsDesc: "Ish haqida ogohlantirishlar va xabarlarni email orqali olish",
        twoFactor: "Ikki bosqichli autentifikatsiya",
        twoFactorDesc: "Hisobingizga qo'shimcha xavfsizlik qatlamini qo'shing",
        privacy: "Maxfiylik",
        visibility: "Profil ko'rinishi",
        visibilityDesc: "Profilingizni qidiruv natijalarida ko'rsatish",
        delete: "Hisobni o'chirish",
        enable: "Yoqish"
      },
      logoutConfirm: {
        title: "Chiqishni tasdiqlash",
        message: "Haqiqatan ham hisobingizdan chiqmoqchimisiz?",
        confirm: "Chiqish",
        cancel: "Bekor qilish"
      },
      cv: {
        view: "CV-ni ko'rish",
        download: "CV-ni yuklab olish"
      },
      paymentSetup: {
        title: "To'lov usulini sozlash",
        subtitle: "Iltimos, bajarilgan topshiriqlar uchun to'lovlarni qabul qilish uchun bank hisobingiz tafsilotlarini kiriting.",
        method: "To'lov usuli",
        bankName: "Bank nomi",
        accountHolder: "Hisob egasining ismi",
        accountNumber: "Hisob raqami / IBAN",
        swiftCode: "SWIFT / BIC kodi",
        routingNumber: "Routing raqami (ixtiyoriy)",
        bankAddress: "Bank manzili",
        accountType: "Hisob turi",
        checking: "Joriy",
        savings: "Jamg'arma",
        currency: "Valyuta",
        exit: "Chiqish",
        save: "To'lov tafsilotlarini saqlash",
        saving: "Saqlanmoqda...",
        success: "To'lov tafsilotlari saqlandi",
        successDesc: "Sizning to'lov ma'lumotlaringiz muvaffaqiyatli yangilandi.",
        error: "Saqlashda xatolik",
        errorDesc: "To'lov tafsilotlarini saqlab bo'lmadi. Iltimos, qaytadan urunib ko'ring."
      }
    },
    clientPortal: {
      welcome: "Mijoz portali",
      guest: "Mehmon",
      subtitle: "Boshlash uchun quyidagi bo'limni tanlang",
      nav: {
        home: "Bosh sahifa",
        logTicket: "Tiket yaratish",
        myTickets: "Mening tiketlarim",
        services: "Xizmatlar va qamrov",
        billing: "Hisob-kitob",
        userManagement: "Foydalanuvchilarni boshqarish",
        companyProfile: "Kompaniya profili",
        help: "Yordam va qo'llab-quvvatlash",
        quotations: "Kotirovkalar",
        messages: "Xabarlar",
        logout: "Chiqish",
        opportunities: "Imkoniyatlar"
      },
      stats: {
        activeTickets: "Faol tiketlar",
        activeTicketsDesc: "Joriy ochiq so'rovlar",
        teamMembers: "Jamoa a'zolari",
        teamMembersDesc: "Boshqariladigan hisoblar"
      },
      quotations: {
        title: "Xizmat kotirovkalari",
        subtitle: "Loyiha xarajatlari smetalarini boshqarish va kuzatish",
        searchPlaceholder: "Loyihalarni qidirish...",
        requestButton: "Kotirovka so'rash",
        loading: "Kotirovkalar yuklanmoqda...",
        estimatedAmount: "Taxminiy summa",
        status: {
          draft: "Qoralama",
          sent: "Yuborilgan",
          approved: "Tasdiqlangan",
          rejected: "Rad etilgan"
        },
        sendToClient: "Mijozga yuborish",
        approve: "Tasdiqlash",
        reject: "Rad etish",
        approveQuote: "Kotirovkani tasdiqlash",
        noQuotations: "Kotirovkalar topilmadi",
        noQuotationsDesc: "Qidiruvni o'zgartirib ko'ring yoki yangi kotirovka so'rang",
        recent: "Yaqinda",
        unknownClient: "Noma'lum mijoz",
        giveQuote: "Kvotani berish",
        quoteAmount: "Kvota miqdori",
        firstTwoHours: "Dastlabki 2 soat",
        additionalHours: "Qo'shimcha soatlar",
        travelCost: "Yo'l xarajatlari",
        quoteDescription: "Kvota tavsifi",
        submitQuote: "Kvotani yuborish",
        modal: {
          title: "Kotirovka so'rash",
          subtitle: "Loyihangiz haqida bizga xabar bering va biz xarajatlar smetasini taqdim etamiz.",
          projectName: "Loyiha nomi",
          projectNamePlaceholder: "masalan, Ofis tarmog'ini sozlash",
          description: "Tavsif",
          descriptionPlaceholder: "Ish hajmini tasvirlab bering...",
          estimatedBudget: "Taxminiy byudjet (ixtiyoriy)",
          estimatedBudgetPlaceholder: "masalan, 5,000",
          submit: "So'rovni yuborish"
        },
        notifications: {
          requestSentTitle: "So'rov yuborildi",
          requestSentMessage: "Kotirovka so'rovingiz muvaffaqiyatli yuborildi!",
          requestFailedTitle: "So'rov muvaffaqiyatsiz tugadi",
          requestFailedMessage: "Kotirovka so'rovini yuborib bo'lmadi.",
          statusUpdatedTitle: "Holat yangilandi",
          statusUpdatedMessage: "Kotirovka holati {status} ga yangilandi.",
          updateFailedTitle: "Yangilash muvaffaqiyatsiz tugadi",
          updateFailedMessage: "Kotirovka holatini yangilab bo'lmadi."
        }
      },
      cards: {
        quickActions: { name: "Tezkor harakatlar", desc: "Tez-tez ishlatiladigan funksiyalar va umumiy vazifalar uchun yorliqlarga kirish" },
        logTicket: { name: "Yangi tiket yaratish", desc: "Yangi qo'llab-quvvatlash tiketi yoki xizmat so'rovini yarating va yuboring" },
        activeTickets: { name: "Faol tiketlar", desc: "Hozirgi faol va ochiq tiketlaringizning qisqacha mazmunini ko'ring" },
        awaitingAction: { name: "Harakat kutilmoqda", desc: "Sizning e'tiboringizni yoki tasdiqlashingizni talab qiladigan tiketlar" },
        updates: { name: "Oxirgi yangilanishlar va bildirishnomalar", desc: "Barcha hisob faoliyati va yangilanishlardan xabardor bo'ling" },
        startOpportunity: { name: "Yangi imkoniyatni boshlash", desc: "Yangi loyiha yoki resurs so'rovini boshlang" },
        coordinator: { name: "Tayinlangan Desknet koordinatori", desc: "Sizning maxsus Desknet koordinatoringiz uchun aloqa ma'motlari va tafsilotlar" },
        accountStatus: { name: "Hisob holati", desc: "Hisobingiz holati, billing va xizmat ko'rsatish tafsilotlari haqida umumiy ma'lumot" }
      },
      common: {
        back: "Orqaga",
        return: "Qaytish",
        updating: "Kontent yangilanmoqda",
        updatingDesc: "Ushbu bo'lim hozirda hisobingiz uchun so'nggi ma'lumotlar va funksiyalar bilan yangilanmoqda. Iltimos, tez orada qaytib ko'ring yoki zudlik bilan yordam kerak bo'lsa, qo'llab-quvvatlash xizmatiga murojaat qiling.",
        edit: "Tahrirlash",
        submit: "Yuborish",
        confirm: "Tasdiqlash",
        cancel: "Bekor qilish",
        loading: "Yuklanmoqda...",
        noData: "Ma'lumot topilmadi",
        viewAll: "Hammasini ko'rish",
        online: "Onlayn",
        typeMessage: "Xabar yozing...",
        noMessages: "Hozircha xabarlar yo'q. Qo'llab-quvvatlash xizmati bilan suhbatni boshlang!"
      },
      logTicket: {
        title: "Yangi tiket yaratish",
        serviceType: "Xizmat turi",
        estimatedDuration: "Taxminiy davomiyligi",
        priority: "Ustuvorlik",
        subject: "Mavzu",
        description: "Batafsil tavsif",
        country: "Mamlakat",
        city: "Shahar",
        location: "To'liq manzil",
        contactEmail: "Aloqa emaili",
        contactPhone: "Aloqa telefon raqami",
        specialInstructions: "Maxsus ko'rsatmalar",
        ticketNumber: "Tiket raqami",
        dateTime: "Afzal sana/vaqt",
        review: "Tiketni ko'rib chiqish",
        edit: "Tiketni tahrirlash",
        confirm: "Tasdiqlash va yuborish",
        submitting: "Yuborilmoqda...",
        steps: {
          service: "Xizmat",
          location: "Manzil",
          contact: "Aloqa",
          details: "Tafsilotlar",
          review: "Tekshirish"
        },
        placeholders: {
          subject: "Muammoning qisqacha tavsifi",
          description: "Iloji boricha batafsil ma'lumot bering...",
          location: "To'liq sayt manzili",
          estimatedDuration: "masalan, 4 soat, 2 kun",
          country: "Mamlakatni tanlang",
          city: "Shaharni kiriting",
          contactEmail: "contact@example.com",
          contactPhone: "+1 234 567 890",
          specialInstructions: "Har qanday maxsus kirish talablari yoki sayt qoidalari...",
          ticketNumber: "Ichki havola raqami"
        },
        options: {
          serviceTypes: {
            onDemand: "Talab bo'yicha yuborish",
            project: "Loyihaga asoslangan",
            maintenance: "Texnik xizmat ko'rsatish",
            hourly: "Soatbay",
            halfDay: "Yarim kun",
            fullDay: "To'liq kun"
          },
          priorities: {
            low: "Past",
            medium: "O'rta",
            high: "Yuqori",
            critical: "Kritik (SLA)"
          }
        }
      },
      myTickets: {
        title: "Mening tiketlarim",
        table: {
          id: "ID",
          subject: "Mavzu",
          status: "Holat",
          engineer: "Muhandis",
          date: "Sana",
          priority: "Ustuvorlik",
          type: "Turi",
          actions: "Harakatlar",
          seeMore: "Batafsil"
        },
        filters: {
          all: "Hammasi",
          status: "Holat",
          priority: "Ustuvorlik",
          search: "Tiketlarni qidirish..."
        },
        status: {
          completed: "Tugallangan",
          resolved: "Hal qilingan",
          inProgress: "Jarayonda",
          onSite: "Muhandis ob'ektda",
          assigned: "Muhandis tayinlangan",
          quoteAccepted: "Kotirovka qabul qilindi",
          quoted: "Kotirovka berildi",
          approved: "Tasdiqlangan",
          rejected: "Rad etilgan",
          open: "Ochiq",
          waitingForConfirmation: "Tasdiqlash kutilmoqda",
          confirmCompletion: "Bajarilganini tasdiqlash",
          rateEngineer: "Muhandisni qanday baholaysiz?",
          ratingSuccess: "Fikr-mulohazangiz uchun rahmat!"
        }
      },
      billing: {
        title: "Billing va hisob-fakturalar",
        balance: "Joriy balans",
        pending: "Kutilayotgan bildirishnomalar",
        nextBilling: "Keyingi hisob-kitob sanasi",
        recentInvoices: "Oxirgi hisob-fakturalar"
      },
      subItems: {
        myTickets: {
          list: "Tiketlar ro'yxati",
          filters: "Filtrlar",
          timeline: "Tiket holati xronologiyasi",
          quotation: "Kotirovka va xarajatlar ko'rinishi",
          engineer: "Muhandis tayinlash tafsilotlari",
          comments: "Tiket sharhlari va yangilanishlari",
          completion: "Tugatish va qayta aloqa harakatlari"
        },
        services: {
          catalog: "Xizmatlar katalogi",
          models: "Hamkorlik modellari",
          coverage: "Mamlakat qamrovi",
          rates: "Standart stavka ko'rsatmalari",
          notes: "Tijorat eslatmalari"
        },
        billing: {
          advice: "Oylik billing maslahati",
          approval: "Billing maslahatini tasdiqlash",
          invoices: "Hisob-fakturalar",
          history: "Billing tarixi"
        },
        userManagement: {
          addRemove: "Foydalanuvchilarni qo'shish/o'chirish",
          access: "Kirish nazorati"
        },
        opportunities: {
          dispatch: "Talab bo'yicha yuborish",
          project: "Loyiha asosida",
          contract: "Shartnoma asosida",
          fte: "To'liq stavka",
          msp: "Boshqariladigan xizmatlar",
          tracking: "Imkoniyatlarni kuzatish"
        },
        companyProfile: {
          details: "Kompaniya tafsilotlari",
          contact: "Aloqa ma'lumotlari",
          location: "Manzil",
          billing: "Billing ma'lumotlari",
          operating: "Faoliyat yuritayotgan mamlakatlar",
          industry: "Sanoat"
        },
        help: {
          howItWorks: "Bu qanday ishlaydi",
          faqs: "Ko'p beriladigan savollar",
          contact: "Yordam xizmati aloqa ma'lumotlari",
          country: "Mamlakat yordami",
          city: "Shahar yordami",
          guidelines: "Portal ko'rsatmalari",
          mapTimeZones: "Xarita va vaqt zonalari",
          dispatcherTools: "Dispetcher asboblari",
          trucks: "Yuk mashinalari"
        }
      },
      services: {
        title: "Xizmatlar va qamrov",
        itManagement: { title: "IT boshqaruvi va joylashtirish", price: "Maxsus kotirovka", desc: "Biz sizning IT tizimlaringizni boshidan oxirigacha boshqaramiz — sozlash, yangilash va infratuzilmangizni yoki dasturiy ta'minotingizni ko'chirishni o'z ichiga oladi — biznesingiz uzilishlarsiz ishlashini ta'minlash uchun." },
        infrastructure: { title: "Infratuzilmani qurish va sozlash", price: "Maxsus kotirovka", desc: "FIXORE IT Global maqsadlaringizga mos keladigan IT tizimlarini loyihalashtiradi, quradi va takomillashtiradi, yuqori unumdorlikni, oson o'sishni va barcha standartlarga to'liq muvofiqlikni ta'minlaydi." },
        support: { title: "Foydalanuvchi va tarmoqni qo'llab-quvvatlash", price: "Maxsus kotirovka", desc: "Ko'p darajali IT-qo'llab-quvvatlash joyida, masofaviy va tarmoq xizmatlari orqali taqdim etiladi, bu har bir biznes uchun tezkor javob va ishonchli ishlashni ta'minlaydi." },
        maintenance: { title: "Texnik xizmat ko'rsatish va IMAC xizmatlari", price: "Maxsus kotirovka", desc: "Kundalik IT ishlarining muammosiz ishlashini ta'minlaydigan va ish vaqtini imkon qadar qisqartiradigan ta'mirlash va to'liq IMAC (o'rnatish, ko'chirish, qo'shish, o'zgartirish) xizmatlari." },
        asset: { title: "Aktivlarning hayot aylanishi va qayta ishlash", price: "Maxsus kotirovka", desc: "Ma'lumotlar xavfsizligi va atrof-muhit standartlariga qat'iy rioya qilgan holda olib tashlash, qayta foydalanish, utilizatsiya qilish va qayta sotishni o'z ichiga olgan xavfsiz va mas'uliyatli IT-aktivlarini boshqarish." },
        coverage: {
          title: "Global qamrov",
          desc: "Biz 94+ ta mamlakatda 20 000 dan ortiq sertifikatlangan muhandislar tarmog'i bilan xizmat ko'rsatamiz.",
          cta: "Qamrov xaritasini ko'rish"
        }
      },
      userManagement: {
        title: "Foydalanuvchilarni boshqarish",
        addUser: "Foydalanuvchi qo'shish",
        noUsers: "Sub-foydalanuvchilar topilmadi. Birinchi jamoa a'zosini qo'shing!"
      },
      companyProfile: {
        title: "Kompaniya profili",
        memberSince: "A'zo bo'lgan sana",
        generalInfo: "Umumiy ma'lumot",
        industry: "Sanoat",
        employees: "Xodimlar",
        website: "Veb-sayt",
        contactDetails: "Aloqa ma'lumotlari",
        primaryAddress: "Asosiy manzil",
        country: "Mamlakat",
        city: "Shahar",
        location: "To'liq manzil",
        description: "Kompaniya tavsifi",
        taxId: "STIR / QQS raqami",
        yearFounded: "Tashkil etilgan yil",
        linkedin: "LinkedIn profili",
        primaryContact: "Asosiy aloqa shaxsi"
      },
      help: {
        title: "Yordam va qo'llab-quvvatlash",
        faqs: "Ko'p beriladigan savollar",
        faqItems: [
          { q: 'Kritik chiptalar uchun SLA qanday?', a: 'Kritik chiptalar uchun 4 soatlik joyida javob berish vaqti kafolatlanadi.' },
          { q: 'Muhandislar qanday tekshiriladi?', a: 'Barcha muhandislar texnik baholash va fon tekshiruvidan o\'tadilar.' },
          { q: 'Rejalashtirilgan jo\'natishni bekor qila olamanmi?', a: 'Ha, lekin 24 soat ichida bekor qilish to\'lovga olib kelishi mumkin.' }
        ],
        howItWorksItems: [
          { step: '01', title: 'Chipta yaratish', desc: 'So\'rovingizni portal orqali yuboring.' },
          { step: '02', title: 'Tayinlash', desc: 'Biz tasdiqlangan muhandisni tanlaymiz.' },
          { step: '03', title: 'Bajarish', desc: 'Muhandis ishni joyida bajaradi.' },
          { step: '04', title: 'Yakunlash', desc: 'Xizmatni ko\'rib chiqing va tasdiqlang.' }
        ],
        immediateHelp: "Zudlik bilan yordam kerakmi?",
        supportCenter: "Global qo'llab-quvvatlash markazi",
        accountManager: "Hisob menejeri",
        managerName: "Alex Thompson",
        managerRole: "Maxsus muvaffaqiyat menejeri",
        supportDesc: "Bizning qo'llab-quvvatlash jamoamiz har qanday texnik muammolarda yordam berish uchun 24/7 ishlaydi.",
        liveChat: "Jonli chat",
        waitTime: "O'rtacha kutish vaqti: 2 daqiqa",
        startChat: "Chatni boshlash"
      },
      messages: {
        title: "Xabarlar",
        conversations: "Suhbatlar",
        activeChat: "Faol yordam chati"
      },
      addUser: {
        title: "Yangi foydalanuvchi qo'shish",
        username: "Foydalanuvchi nomi",
        usernamePlaceholder: "Foydalanuvchi nomini kiriting",
        email: "Elektron pochta manzili",
        emailPlaceholder: "user@company.com",
        role: "Rol",
        roles: {
          admin: "Admin",
          manager: "Menejer",
          viewer: "Ko'ruvchi"
        },
        submit: "Foydalanuvchi yaratish"
      }
    },
    settings: {
      title: "Sozlamalar",
      profile: "Profil",
      security: "Xavfsizlik",
      notifications: "Bildirishnomalar",
      preferences: "Afzalliklar",
      profileInfo: "Profil ma'lumotlari",
      profileDesc: "Shaxsiy ma'lumotlaringizni va platformada boshqalar sizni qanday ko'rishini yangilang.",
      fullName: "To'liq ism",
      email: "Elektron pochta manzili",
      phone: "Telefon raqami",
      saveChanges: "O'zgarishlarni saqlash",
      securitySettings: "Xavfsizlik sozlamalari",
      securityDesc: "Parolingizni va hisobingiz xavfsizlik sozlamalarini boshqaring.",
      passwordReq: "Parol talablari",
      passwordReqDesc: "Hisobingizni xavfsiz saqlash uchun parollar kamida 8 ta belgidan iborat bo'lishi va harflar, raqamlar va belgilar aralashmasini o'z ichiga olishi kerak.",
      newPassword: "Yangi parol",
      confirmPassword: "Yangi parolni tasdiqlang",
      updatePassword: "Parolni yangilash",
      notifPrefs: "Bildirishnoma sozlamalari",
      notifDesc: "Desknet platformasidan yangilanishlarni qanday va qachon olishingizni nazorat qiling.",
      emailNotif: "Elektron pochta bildirishnomalari",
      emailNotifDesc: "Chiptalar, ishlar va hisob-fakturalar haqidagi yangilanishlarni elektron pochta orqali oling.",
      pushNotif: "Push bildirishnomalari",
      pushNotifDesc: "Brauzeringizda yoki mobil qurilmangizda real vaqt rejimida ogohlantirishlarni oling.",
      smsNotif: "SMS ogohlantirishlar",
      smsNotifDesc: "Muhim tizim ogohlantirishlarini matnli xabar orqali oling.",
      marketingNotif: "Marketing yangilanishlari",
      marketingNotifDesc: "Yangi funksiyalar va platforma takomillashtirilishi haqida xabardor bo'ling.",
      saveNotif: "Bildirishnoma sozlamalarini saqlash",
      platformPrefs: "Platforma afzalliklari",
      platformDesc: "Interfeys va mahalliylashtirish sozlamalarini moslashtiring.",
      language: "Til",
      appearance: "Ko'rinish",
      light: "Yorug'",
      dark: "To'q",
      timezone: "Vaqt zonasi",
      savePrefs: "Afzalliklarni saqlash",
      dangerZone: "Xavfli hudud",
      deleteAccount: "Hisobni o'chirish",
      deleteDesc: "Hisobingizni va unga bog'liq barcha ma'lumotlarni butunlay o'chirib tashlang. Bu amalni qaytarib bo'lmaydi.",
      deleteConfirmTitle: "Haqiqatan ham ishonchingiz komilmi?",
      deleteConfirmDesc: "Bu amal doimiydir va uni qaytarib bo'lmaydi. Barcha ma'lumotlaringiz, chiptalaringiz va xabarlaringiz abadiy yo'qoladi.",
      deleteConfirmButton: "Ha, hisobimni o'chirish",
      cancel: "Bekor qilish",
      successProfile: "Profil muvaffaqiyatli yangilandi!",
      errorProfile: "Profilni yangilab bo'lmadi. Iltimos, qayta urinib ko'ring.",
      successPassword: "Parol muvaffaqiyatli yangilandi!",
      errorPassword: "Parolni yangilab bo'lmadi.",
      successNotif: "Bildirishnoma sozlamalari saqlandi!",
      errorNotif: "Bildirishnomalarni saqlab bo'lmadi.",
      successPrefs: "Platforma afzalliklari yangilandi!",
      errorPrefs: "Afzalliklarni yangilab bo'lmadi.",
      errorDelete: "Hisobni o'chirib bo'lmadi."
    },
    messaging: {
      translate: "Xabarni tarjima qilish",
      translated: "Tarjima qilindi",
      showOriginal: "Aslini ko'rsatish"
    },
    aiChat: {
      title: "GEN-AI Yordamchi",
      placeholder: "Xizmatlarimiz haqida so'rang...",
      welcome: "Muhandislik kelajagiga xush kelibsiz. Men GEN-AI, sizning ilg'or intellektual yordamchingizman. Bugun tajribangizni qanday optimallashtirishim mumkin?",
      error: "Kechirasiz, xatolik yuz berdi. Iltimos, qayta urinib ko'ring.",
      clear: "Chatni tozalash",
      close: "Yopish"
    }
  }
};
