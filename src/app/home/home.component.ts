import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  user: { name: string; role: string } | null = (() => {
    try {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch (e) {
      console.error('Error parsing user data from localStorage', e);
      return null;
    }
  })();
  navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Features', path: '#features' },
    { name: 'About', path: '#about' },
    { name: 'Contact', path: '#contact' }
  ];

  features = [
    {
      icon: 'bi bi-laptop',
      title: 'Online Exams',
      description: 'Take exams from anywhere with our secure online platform'
    },
    {
      icon: 'bi bi-clock-history',
      title: 'Real-time Results',
      description: 'Get instant feedback and detailed performance analysis'
    },
    {
      icon: 'bi bi-shield-check',
      title: 'Secure Platform',
      description: 'Advanced security measures to ensure exam integrity'
    },
    {
      icon: 'bi bi-graph-up',
      title: 'Performance Tracking',
      description: 'Monitor your progress and identify areas for improvement'
    }
  ];

  coreValues = [
    {
      icon: 'bi bi-lightning-charge',
      title: 'Innovation',
      description: 'Constantly pushing boundaries to deliver cutting-edge solutions'
    },
    {
      icon: 'bi bi-people',
      title: 'Collaboration',
      description: 'Working together to achieve excellence in education'
    },
    {
      icon: 'bi bi-shield-check',
      title: 'Integrity',
      description: 'Maintaining the highest standards of academic honesty'
    },
    {
      icon: 'bi bi-graph-up-arrow',
      title: 'Excellence',
      description: 'Committed to delivering the best educational experience'
    }
  ];

  teamMembers = [
    {
      name: 'Ali Mohamed',
      role: 'Software Engineer',
      image: './assets/alimohamed1.jpg',
      bio: 'Education expert with 2 years of experience in online learning',
      social: {
        linkedin: 'https://www.linkedin.com/in/ali-mohamed-68a0a3239/',
        twitter: '#',
        email: 'mailto:alimohamed11907@gmail.com'
      }
    },
    {
      name: 'Ali Fathy',
      role: 'Technical Director',
      image: './assets/AliFathy.jpg',
      bio: 'Tech innovator specializing in educational platforms',
      social: {
        linkedin: '#',
        twitter: '#',
        email: 'mailto:michael@testera.com'
      }
    },
    {
      name: 'Emily Rodriguez',
      role: 'Student Success Manager',
      image: 'https://randomuser.me/api/portraits/women/3.jpg',
      bio: 'Dedicated to ensuring student success and satisfaction',
      social: {
        linkedin: '#',
        twitter: '#',
        email: 'mailto:emily@testera.com'
      }
    },
    {
      name: 'David Kim',
      role: 'Security Specialist',
      image: 'https://randomuser.me/api/portraits/men/4.jpg',
      bio: 'Expert in maintaining platform security and integrity',
      social: {
        linkedin: '#',
        twitter: '#',
        email: 'mailto:david@testera.com'
      }
    }
  ];

  contactInfo = {
    address: '123 Education Street, Tech City, TC 12345',
    phone: '+1 (555) 123-4567',
    email: 'contact@testera.com',
    social: {
      facebook: '#',
      twitter: '#',
      linkedin: '#',
      instagram: '#'
    }
  };

  stats = [
    {
      number: '10K+',
      label: 'Active Students',
      icon: 'bi bi-people'
    },
    {
      number: '500+',
      label: 'Exams Created',
      icon: 'bi bi-file-text'
    },
    {
      number: '98%',
      label: 'Success Rate',
      icon: 'bi bi-trophy'
    },
    {
      number: '24/7',
      label: 'Support',
      icon: 'bi bi-headset'
    }
  ];

  testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Computer Science Student',
      image: './assets/image_fx_.jpg',
      text: 'Testera has revolutionized how I prepare for my exams. The platform is intuitive and the instant feedback helps me improve quickly.'
    },
    {
      name: 'Michael Chen',
      role: 'Engineering Student',
      image: './assets/freepik__the-style-is-candid-image-photography-with-natural__67823.png',
      text: 'The real-time results and detailed analytics have been invaluable for my exam preparation. Highly recommended!'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Medical Student',
      image: './assets/freepik__the-style-is-candid-image-photography-with-natural__31151.png',
      text: 'As a medical student, I need reliable exam platforms. Testera provides exactly that with its secure and efficient system.'
    }
  ];

  footerLinks = {
    company: [
      { name: 'About Us', link: '#' },
      { name: 'Careers', link: '#' },
      { name: 'Contact', link: '#' },
      { name: 'Blog', link: '#' }
    ],
    resources: [
      { name: 'Help Center', link: '#' },
      { name: 'Documentation', link: '#' },
      { name: 'API Reference', link: '#' },
      { name: 'Status', link: '#' }
    ],
    legal: [
      { name: 'Privacy Policy', link: '#' },
      { name: 'Terms of Service', link: '#' },
      { name: 'Cookie Policy', link: '#' },
      { name: 'GDPR', link: '#' }
    ]
  };
} 