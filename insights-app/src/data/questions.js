// Each question set has 4 statements mapping to Blue, Green, Yellow, Red
// energies respectively
export const questions = [
  {
    id: 1,
    statements: [
      { text: "I encourage others to embrace something new", energy: "yellow" },
      { text: "I instinctively know when I hit on a great idea", energy: "yellow" },
      { text: "I stay on track using what I know will work", energy: "blue" },
      { text: "I will reflect on how my current experience is like a past one", energy: "green" },
    ]
  },
  {
    id: 2,
    statements: [
      { text: "I am impartial in my reasoning", energy: "blue" },
      { text: "I speak firmly in support of an objective", energy: "red" },
      { text: "I find it easy to adapt to different groups", energy: "green" },
      { text: "I prioritise deep personal relationships", energy: "green" },
    ]
  },
  {
    id: 3,
    statements: [
      { text: "I always find the most logical solution", energy: "blue" },
      { text: "I move quickly to get things done", energy: "red" },
      { text: "I like to bring people together for a shared goal", energy: "green" },
      { text: "I generate many creative ideas", energy: "yellow" },
    ]
  },
  {
    id: 4,
    statements: [
      { text: "I like to analyse data before making decisions", energy: "blue" },
      { text: "I enjoy taking charge of a situation", energy: "red" },
      { text: "I am a good listener and enjoy supporting others", energy: "green" },
      { text: "I thrive when exploring new possibilities", energy: "yellow" },
    ]
  },
  {
    id: 5,
    statements: [
      { text: "I prefer structure and order in my work", energy: "blue" },
      { text: "I am direct and assertive in communication", energy: "red" },
      { text: "I am sensitive to others' feelings and needs", energy: "green" },
      { text: "I love spontaneous and exciting opportunities", energy: "yellow" },
    ]
  },
  {
    id: 6,
    statements: [
      { text: "I approach problems systematically", energy: "blue" },
      { text: "I act decisively under pressure", energy: "red" },
      { text: "I build harmony and avoid unnecessary conflict", energy: "green" },
      { text: "I am optimistic and enthusiastic about change", energy: "yellow" },
    ]
  },
  {
    id: 7,
    statements: [
      { text: "I pay close attention to detail and accuracy", energy: "blue" },
      { text: "I am competitive and driven to win", energy: "red" },
      { text: "I value loyalty and commitment in relationships", energy: "green" },
      { text: "I enjoy brainstorming and thinking outside the box", energy: "yellow" },
    ]
  },
  {
    id: 8,
    statements: [
      { text: "I prefer facts and evidence over feelings", energy: "blue" },
      { text: "I set high standards and push for results", energy: "red" },
      { text: "I prefer to work collaboratively in a team", energy: "green" },
      { text: "I am flexible and adapt easily to new situations", energy: "yellow" },
    ]
  },
  {
    id: 9,
    statements: [
      { text: "I like to plan thoroughly before acting", energy: "blue" },
      { text: "I am confident in my own judgement", energy: "red" },
      { text: "I focus on maintaining stable, long-term relationships", energy: "green" },
      { text: "I enjoy experimenting and taking creative risks", energy: "yellow" },
    ]
  },
  {
    id: 10,
    statements: [
      { text: "I evaluate options objectively before deciding", energy: "blue" },
      { text: "I like to set clear targets and achieve them fast", energy: "red" },
      { text: "I care deeply about people's wellbeing", energy: "green" },
      { text: "I am imaginative and enjoy visionary thinking", energy: "yellow" },
    ]
  },
];

export const energyProfiles = {
  blue: {
    name: "Cool Blue",
    color: "#3B82F6",
    bg: "rgba(59,130,246,0.12)",
    border: "rgba(59,130,246,0.3)",
    description: "Cool Blue energy is analytical, precise, and objective. You are methodical and thorough, focusing on facts and logic.",
    traits: ["Analytical", "Precise", "Systematic", "Objective", "Detail-oriented"],
    communication: "Be precise and factual. Provide data and evidence. Allow time for analysis. Avoid rushing decisions.",
    workStyle: [
      "Methodical and thorough in approach",
      "Prefers to plan before acting",
      "Excels at quality control and analysis",
      "Works best with clear processes",
    ]
  },
  green: {
    name: "Earth Green",
    color: "#22C55E",
    bg: "rgba(34,197,94,0.12)",
    border: "rgba(34,197,94,0.3)",
    description: "Earth Green energy prioritizes harmony, relationships, and democratic values. You seek consensus and care deeply about others' wellbeing.",
    traits: ["Empathetic", "Patient", "Collaborative", "Supportive", "Loyal"],
    communication: "Be warm and considerate. Allow time. Acknowledge people and feelings. Avoid being too direct.",
    workStyle: [
      "Patient, flexible and easy to get along with",
      "Little desire to dominate or control others",
      "Realistic and dependable team member",
      "Stays with projects until completion",
    ]
  },
  yellow: {
    name: "Sunshine Yellow",
    color: "#EAB308",
    bg: "rgba(234,179,8,0.12)",
    border: "rgba(234,179,8,0.3)",
    description: "Sunshine Yellow energy is enthusiastic, creative, and social. You inspire others and thrive when exploring new ideas and possibilities.",
    traits: ["Enthusiastic", "Creative", "Sociable", "Optimistic", "Expressive"],
    communication: "Be energetic and enthusiastic. Share the big picture. Allow for creativity. Make it fun and engaging.",
    workStyle: [
      "Brings energy and enthusiasm to teams",
      "Generates creative and innovative ideas",
      "Thrives in dynamic, changing environments",
      "Motivates and inspires others naturally",
    ]
  },
  red: {
    name: "Fiery Red",
    color: "#EF4444",
    bg: "rgba(239,68,68,0.12)",
    border: "rgba(239,68,68,0.3)",
    description: "Fiery Red energy is direct, determined, and driven. You are action-oriented and focus on results, taking charge with confidence.",
    traits: ["Decisive", "Assertive", "Results-driven", "Competitive", "Bold"],
    communication: "Be direct and concise. Focus on results and outcomes. Avoid too much detail. Respect their time.",
    workStyle: [
      "Takes charge and drives results",
      "Decisive and confident under pressure",
      "Sets ambitious goals and pursues them",
      "Energised by challenge and competition",
    ]
  }
};
