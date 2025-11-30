import { Application, ChatMessage, PaginatedResponse } from '../types/application';

type RequestOptions = RequestInit & { useMock?: boolean };

const demoApplication: Application = {
  applicationId: 'demo-app-1',
  jobKey: 'ENG-123',
  jobTitle: 'Senior Backend Engineer',
  candidateUserId: 'candidate-42',
  createdAt: new Date().toISOString(),
  match: {
    score: 82,
    strengths: ['Extensive backend leadership', '10+ years Node.js', 'Previous fintech exposure'],
    gaps: ['Limited Rust experience', 'Needs more Terraform depth'],
    insights: [
      'Skills: Node.js, TypeScript, PostgreSQL, AWS',
      'Experience: Led platform squads, built ML infrastructure',
      'Education: MS Computer Science, State University',
      'Summary: Strong fit for backend leadership roles',
    ],
    experienceHighlight: '4+ years of experience across Client Relationship Management, Renewals & Upsell / Cross-sell, Proposal Preparation & Negotiations.',
    breakdown: {
      skills: ['Node.js', 'TypeScript', 'PostgreSQL', 'AWS'],
      experience: ['Led platform squad of 8 engineers', 'Architected ML data pipelines'],
      education: ['MS Computer Science, State University'],
      summary: 'Seasoned backend leader comfortable with regulated industries.',
    },
  },
};

const chatHistory: ChatMessage[] = [
  {
    id: 'msg-1',
    applicationId: demoApplication.applicationId,
    role: 'assistant',
    content: 'The candidate has strong backend architecture experience and has led teams of 8 engineers.',
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
  {
    id: 'msg-2',
    applicationId: demoApplication.applicationId,
    role: 'user',
    content: 'Do they have any exposure to PostgreSQL and data warehousing?',
    createdAt: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
  },
];

export async function mockRequest<T>(path: string, options: RequestOptions): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  if (path === '/applications' && options.method === 'POST') {
    return { ...demoApplication, applicationId: crypto.randomUUID() } as T;
  }

  if (path.startsWith('/applications/') && path.endsWith('/chat') && options.method === 'POST') {
    const message = JSON.parse(options.body as string).question;
    const reply: ChatMessage = {
      id: crypto.randomUUID(),
      applicationId: demoApplication.applicationId,
      role: 'assistant',
      content: `Mock insight: ${message}`,
      createdAt: new Date().toISOString(),
      sources: [
        {
          type: 'resume',
          chunkId: 'chunk-1',
          excerpt: 'Resume excerpt referencing requested info.',
        },
      ],
    };
    chatHistory.push(reply);
    return { answer: reply.content, sources: reply.sources } as T;
  }

  if (path.endsWith('/chats')) {
    return {
      messages: chatHistory,
      total: chatHistory.length,
      limit: 50,
      offset: 0,
    } as T;
  }

  return demoApplication as T;
}
