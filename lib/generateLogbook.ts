export type LogbookPayload = {
  description: string;
  startDate: string;
  endDate?: string;
  days?: string[];
  tools?: string;
  skills?: string;
  challenges?: string;
  supervisor?: string;
};

export const buildPrompt = (p: LogbookPayload) => {
  const duration = p.endDate ? `${p.startDate} to ${p.endDate}` : p.startDate;
  const daysLine = p.days && p.days.length ? `Days involved: ${p.days.join(", ")}.` : "";
  const tools = p.tools ? `Tools/Equipment: ${p.tools}.` : "";
  const skills = p.skills ? `Skills Learned: ${p.skills}.` : "";
  const challenges = p.challenges ? `Challenges: ${p.challenges}.` : "";
  const supervisor = p.supervisor ? `Supervisor Comments: ${p.supervisor}.` : "";

  // Determine entry type (daily, weekly, or monthly) based on date range
  const startDate = new Date(p.startDate);
  const endDate = p.endDate ? new Date(p.endDate) : null;
  const daysDiff = endDate ? Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) : 0;
  
  let entryType = "DAILY";
  let wordCount = "180–250";
  if (daysDiff >= 25) {
    entryType = "MONTHLY";
    wordCount = "300–400";
  } else if (daysDiff >= 5) {
    entryType = "WEEKLY";
    wordCount = "250–350";
  }

  // Generate full dates for each selected day in weekly entries
  const generateDayDates = () => {
    if (!p.days || p.days.length === 0 || !endDate) return "";
    
    const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    return p.days.map(dayName => {
      const dayIndex = dayOrder.indexOf(dayName);
      if (dayIndex === -1) return `${dayName}:\n[2–3 sentences in past tense describing what was accomplished]`;
      
      // Find the date for this day of the week within the range
      const current = new Date(startDate);
      while (current <= endDate) {
        if (current.getDay() === (dayIndex + 1) % 7) {
          const day = current.getDate();
          const month = monthNames[current.getMonth()];
          const year = current.getFullYear();
          const suffix = day === 1 || day === 21 || day === 31 ? "st" : 
                        day === 2 || day === 22 ? "nd" : 
                        day === 3 || day === 23 ? "rd" : "th";
          return `${dayName}, ${day}${suffix} ${month} ${year}:\n[2–3 sentences in past tense describing what was accomplished. Start with action verbs: "Was introduced to", "Worked on", "Explored", "Studied", "Analysed", "Implemented", "Investigated", "Examined", "Developed". Be specific with technical concepts and practical applications.]`;
        }
        current.setDate(current.getDate() + 1);
      }
      return `${dayName}:\n[2–3 sentences in past tense describing what was accomplished]`;
    }).join("\n\n");
  };

  return `You are an expert technical writer specialising in professional engineering logbooks.
Your task is to create a top 1% quality ${entryType} logbook entry that is polished, specific, reflective, and ready for direct inclusion in an official engineering logbook.
The writing must use British/International English, impeccable grammar, and a formal yet natural professional tone.

INPUT CONTEXT

• Period: ${duration}
${daysLine ? `• ${daysLine}` : ""}
• Activities: ${p.description}
${tools ? `• Tools/Equipment: ${tools}` : ""}
${skills ? `• Skills Applied: ${skills}` : ""}
${challenges ? `• Challenges: ${challenges}` : ""}
${supervisor ? `• Supervisor: ${supervisor}` : ""}

FORMATTING & OUTPUT REQUIREMENTS (MANDATORY)

You must follow the structure exactly as specified below for the given entry type.
The output must be professionally formatted, fully expanded, and ready to paste into a printed or digital logbook without further editing.

${entryType === "DAILY" ? `
DAILY LOGBOOK ENTRY FORMAT

Write in natural prose paragraphs following this structure:

[Day, DD Month YYYY]:
[2–4 sentences describing tasks completed using past tense and action verbs like "Worked on", "Studied", "Explored", "Analysed", "Implemented", "Investigated". Use technical terminology and provide specific context about what was accomplished, concepts learned, and practical applications.]

EXAMPLE:
"Monday, 15 September 2025:
Worked on integrating the authentication module into the existing user management system. Studied OAuth 2.0 protocols and implemented secure token-based authentication using JWT. Explored best practices for password hashing and successfully deployed bcrypt with appropriate salt rounds for enhanced security. Collaborated with the senior developer to troubleshoot session management issues."

STYLE REQUIREMENTS:
- Natural flowing prose (NOT bullet points)
- Past tense throughout
- Specific technical detail
- 2-4 complete sentences
- Professional but readable
` : ""}

${entryType === "WEEKLY" ? `
WEEKLY LOGBOOK ENTRY FORMAT

Write in this EXACT narrative style:

Week [Number] – [Brief Topic/Title]

${p.days && p.days.length > 0 ? generateDayDates() : `Monday, [Date with suffix] [Month] [Year]:
[2–3 sentences in natural prose describing Monday's activities]

Tuesday, [Date with suffix] [Month] [Year]:
[2–3 sentences for Tuesday]

Wednesday, [Date with suffix] [Month] [Year]:
[2–3 sentences for Wednesday]

Thursday, [Date with suffix] [Month] [Year]:
[2–3 sentences for Thursday]

Friday, [Date with suffix] [Month] [Year]:
[2–3 sentences for Friday]`}

EXAMPLE WEEKLY ENTRY:
"Week 10 – Electromagnetic Rockets and Propellant Selection

Monday, 19th September 2025:
Was introduced to the concept of electromagnetic rockets and their application in modern propulsion systems. Studied how electromagnetic forces are used to accelerate charged particles for thrust generation in space missions.

Tuesday, 20th September 2025:
Explored the operational principles and advantages of electromagnetic propulsion compared to conventional chemical rockets. Understood the engineering considerations involved in designing efficient electromagnetic thrusters.

Wednesday, 21st September 2025:
Worked on problem statements related to propellant selection, analysing how different propellant types affect performance, efficiency, and mission requirements. Applied theoretical knowledge to practical case scenarios to reinforce understanding of propulsion system optimisation.

Thursday, 22nd September 2025:
Investigated hybrid propulsion systems combining conventional and electromagnetic technologies. Examined real-world case studies from NASA and ESA missions demonstrating practical implementations of these advanced propulsion concepts.

Friday, 23rd September 2025:
Completed design calculations for a conceptual electromagnetic thruster configuration. Presented findings to the team and received constructive feedback on optimisation strategies and efficiency improvements."

CRITICAL STYLE REQUIREMENTS:
- Each day MUST include the full date: "[Day], [Date][suffix] [Month] [Year]:"
- Natural paragraph format for each day (NO bullet points)
- Start each day with action verbs in past tense
- Each day = 2-3 complete, flowing sentences
- Progressive narrative showing learning journey
- Technical terminology in readable prose
- Blank line between days
- Week title should summarise the main topic/theme
- Use date suffixes: 1st, 2nd, 3rd, 4th, 5th, etc.
` : ""}

${entryType === "MONTHLY" ? `
MONTHLY LOGBOOK ENTRY FORMAT

Month [Number/Name] – [Overall Theme/Focus Area]

OVERVIEW:
[Write 4–5 sentences providing a high-level summary of the month's primary focus, major projects completed, and overall learning progression. Use past tense and natural prose.]

WEEKLY BREAKDOWN:

Week 1 – [Topic/Focus]:
[3–4 sentences summarising the week's key activities, learning outcomes, and technical concepts covered. Use natural prose with specific details.]

Week 2 – [Topic/Focus]:
[3–4 sentences for week 2]

Week 3 – [Topic/Focus]:
[3–4 sentences for week 3]

Week 4 – [Topic/Focus]:
[3–4 sentences for week 4]

TECHNICAL COMPETENCIES DEVELOPED:
[Write a flowing paragraph listing and briefly explaining the main technical skills, tools, and methodologies mastered during the month. Use natural prose, weaving skills together with context rather than bullet points.]

TOOLS, TECHNOLOGIES & METHODOLOGIES:
[List all relevant software, equipment, frameworks, and methodologies used throughout the month, with versions/specifications where relevant. Can use comma-separated format or brief bullets if needed for clarity.]

SIGNIFICANT CHALLENGES & SOLUTIONS:
[Write 1-2 paragraphs describing major obstacles encountered and how they were resolved. Include specific technical problems, analytical approaches used, and lessons learned from the problem-solving process.]

PROFESSIONAL DEVELOPMENT & INSIGHTS:
[Write 2–3 paragraphs reflecting on:
- How this month's work connected to theoretical knowledge from academic studies
- Professional skills developed (teamwork, communication, project management, etc.)
- Industry insights or best practices observed
- Areas for future improvement or learning goals
- Connections between practical work and engineering principles]

${p.supervisor ? `SUPERVISOR COMMENTS:\n[Include detailed supervisor feedback]` : `SUPERVISOR EVALUATION:\n[Monthly review completed and approved by [Name/Title]]`}

ATTENDANCE & HOURS:
[If applicable: "Total hours completed: [X] hours over [Y] days"]

STYLE REQUIREMENTS:
- Natural flowing paragraphs throughout
- Past tense, active voice
- Technical but highly readable
- Professional narrative format
- Minimal bullet points (use prose wherever possible)
` : ""}

FINAL INSTRUCTIONS

1. Use the exact structure above — no missing sections or markdown formatting symbols (**, ##, etc.)
2. Replace all placeholders with accurate, professional content derived from the input context
3. Write in PAST TENSE using active, precise engineering language
4. Be specific and measurable — include versions, quantities, parameters, or metrics if known
5. Maintain a formal yet natural tone appropriate for an accredited engineering logbook
6. Ensure grammatical excellence and logical flow throughout
7. Target word count: ${wordCount} words (within ±10%)
8. The final text must be print-ready and require ZERO manual editing before official submission
9. Do NOT fabricate technical details — generalise professionally if specific information is missing
10. Ensure clear spacing between sections for readability in a printed document
11. Use British/International English spelling: "analysed", "optimisation", "utilised", "recognised"
12. Show PROGRESSION and LEARNING JOURNEY — each day/week should build on previous work
13. Use NATURAL PROSE — this should read like a professional diary, not a formal report
14. Output plain text only — no code blocks, no markdown, just clean formatted text

Generate the complete ${entryType.toLowerCase()} logbook entry now, following the exact format and style shown above:`;
};
