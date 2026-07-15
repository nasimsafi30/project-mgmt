interface SearchResult {
  id: string;
  type: 'task' | 'project' | 'team' | 'comment';
  title: string;
  description?: string;
  url: string;
  relevance: number;
  updatedAt: string;
}

interface SearchFilters {
  type?: string[];
  projectId?: string;
  status?: string[];
  priority?: string[];
}

class SearchEngine {
  async search(query: string, filters: SearchFilters = {}, limit: number = 20): Promise<SearchResult[]> {
    if (!query || query.length < 2) return [];

    try {
      const params = new URLSearchParams({ q: query });
      if (filters.type?.length) params.set('type', filters.type.join(','));
      if (filters.projectId) params.set('projectId', filters.projectId);

      const response = await fetch(`/api/search?${params.toString()}`);
      if (!response.ok) return [];
      
      const data = await response.json();
      return (data.results || []).slice(0, limit);
    } catch (error) {
      console.error('Search failed:', error);
      return [];
    }
  }

  async autocomplete(query: string, limit: number = 5): Promise<string[]> {
    if (query.length < 2) return [];
    
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=${limit}`);
      const data = await response.json();
      return (data.results || []).map((r: SearchResult) => r.title);
    } catch {
      return [];
    }
  }

  highlightMatch(text: string, query: string): string {
    if (!query) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200 rounded px-0.5">$1</mark>');
  }
}

export const searchEngine = new SearchEngine();