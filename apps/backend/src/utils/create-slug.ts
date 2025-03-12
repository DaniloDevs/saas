export function createSlug(text: string): string {
     return text
       .normalize('NFD')
       .replace(/[\u0300-\u036f]/g, '') // Remove acentos
       .replace(/[^\w\s]/gi, '') // Remove caracteres especiais
       .trim()
       .replace(/\s+/g, '-') // Substitui espaços por hífens
       .toLowerCase();
   }
   