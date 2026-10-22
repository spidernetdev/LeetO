export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'What is LeetO?',
    answer:
      'LeetO is an automated progress tracking and algorithm pattern classification application for developers preparing for technical coding interviews. It pairs a lightweight Chrome extension with an IDE-grade Next.js progress dashboard to help you organize solutions and identify common problem-solving patterns.'
  },
  {
    question: 'How does it work with LeetCode?',
    answer:
      'When you solve a problem on leetcode.com and receive an "Accepted" verdict, the LeetO Chrome extension automatically detects the verdict, extracts your submitted code, language, and problem metadata, and saves it into your progress repository without requiring you to switch tabs or manually maintain notes.'
  },
  {
    question: 'Does it track submissions automatically?',
    answer:
      'Yes. You only need to install and configure the Chrome extension once. From that moment on, whenever you click "Submit" on LeetCode and the submission passes all test cases, it is logged automatically. You can also manually log solutions inside the web app using the "Log Solution" modal at any time.'
  },
  {
    question: 'How are problems categorized?',
    answer:
      'Solutions are organized into 12 recognized algorithmic pattern classes (including Two Pointers, Sliding Window, Binary Search, Dynamic Programming, Monotonic Stack, Trees, and Graphs). This allows you to study the recurring principles behind solutions rather than memorizing isolated problem answers.'
  },
  {
    question: 'How can I view my progress?',
    answer:
      'Your dashboard provides comprehensive statistics: total problems solved, Easy/Medium/Hard volume breakdown, practice velocity over time, pattern distribution percentages, and a 90-day consistency heatmap displaying your active daily practice streak.'
  },
  {
    question: 'How do I install the Chrome extension?',
    answer:
      'Click the "Download Chrome Extension" button to access the extension bundle. Load the extension in any Chromium-based browser (Google Chrome, Brave, Edge, Arc) via Developer Mode, and you are ready to practice.'
  }
];
