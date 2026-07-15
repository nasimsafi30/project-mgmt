type Language = 'en' | 'es' | 'fr';

const translations: Record<Language, Record<string, any>> = {
  en: {
    common: { save: 'Save', cancel: 'Cancel', delete: 'Delete', edit: 'Edit', create: 'Create', search: 'Search', loading: 'Loading...', error: 'An error occurred', success: 'Success', confirm: 'Confirm', back: 'Back', next: 'Next', close: 'Close', yes: 'Yes', no: 'No' },
    nav: { dashboard: 'Dashboard', board: 'Kanban Board', calendar: 'Calendar', teams: 'Teams', timeTracking: 'Time Tracking', reports: 'Reports', settings: 'Settings', sprints: 'Sprints', gantt: 'Gantt Chart' },
    task: { create: 'Create Task', edit: 'Edit Task', delete: 'Delete Task', title: 'Title', description: 'Description', status: 'Status', priority: 'Priority', assignee: 'Assignee', dueDate: 'Due Date', noTasks: 'No tasks found' },
    status: { backlog: 'Backlog', todo: 'To Do', in_progress: 'In Progress', in_review: 'In Review', done: 'Done' },
    priority: { low: 'Low', medium: 'Medium', high: 'High', urgent: 'Urgent' },
    errors: { required: 'This field is required', invalidEmail: 'Invalid email', networkError: 'Network error', unauthorized: 'Unauthorized', notFound: 'Not found', serverError: 'Server error' },
  },
  es: {
    common: { save: 'Guardar', cancel: 'Cancelar', delete: 'Eliminar', edit: 'Editar', create: 'Crear', search: 'Buscar', loading: 'Cargando...', error: 'Error', success: 'Ã‰xito', confirm: 'Confirmar', back: 'Volver', next: 'Siguiente', close: 'Cerrar', yes: 'SÃ­', no: 'No' },
    nav: { dashboard: 'Panel', board: 'Tablero', calendar: 'Calendario', teams: 'Equipos', timeTracking: 'Tiempo', reports: 'Informes', settings: 'ConfiguraciÃ³n', sprints: 'Sprints', gantt: 'Gantt' },
    task: { create: 'Crear Tarea', edit: 'Editar Tarea', delete: 'Eliminar Tarea', title: 'TÃ­tulo', description: 'DescripciÃ³n', status: 'Estado', priority: 'Prioridad', assignee: 'Asignado', dueDate: 'Fecha lÃ­mite', noTasks: 'Sin tareas' },
    status: { backlog: 'Pendiente', todo: 'Por Hacer', in_progress: 'En Progreso', in_review: 'En RevisiÃ³n', done: 'Hecho' },
    priority: { low: 'Baja', medium: 'Media', high: 'Alta', urgent: 'Urgente' },
    errors: { required: 'Campo requerido', invalidEmail: 'Email invÃ¡lido', networkError: 'Error de red', unauthorized: 'No autorizado', notFound: 'No encontrado', serverError: 'Error del servidor' },
  },
  fr: {
    common: { save: 'Enregistrer', cancel: 'Annuler', delete: 'Supprimer', edit: 'Modifier', create: 'CrÃ©er', search: 'Rechercher', loading: 'Chargement...', error: 'Erreur', success: 'SuccÃ¨s', confirm: 'Confirmer', back: 'Retour', next: 'Suivant', close: 'Fermer', yes: 'Oui', no: 'Non' },
    nav: { dashboard: 'Tableau de bord', board: 'Tableau', calendar: 'Calendrier', teams: 'Ã‰quipes', timeTracking: 'Temps', reports: 'Rapports', settings: 'ParamÃ¨tres', sprints: 'Sprints', gantt: 'Gantt' },
    task: { create: 'CrÃ©er TÃ¢che', edit: 'Modifier TÃ¢che', delete: 'Supprimer TÃ¢che', title: 'Titre', description: 'Description', status: 'Statut', priority: 'PrioritÃ©', assignee: 'AssignÃ©', dueDate: 'Date limite', noTasks: 'Aucune tÃ¢che' },
    status: { backlog: 'Backlog', todo: 'Ã€ Faire', in_progress: 'En Cours', in_review: 'En RÃ©vision', done: 'TerminÃ©' },
    priority: { low: 'Basse', medium: 'Moyenne', high: 'Haute', urgent: 'Urgente' },
    errors: { required: 'Champ requis', invalidEmail: 'Email invalide', networkError: 'Erreur rÃ©seau', unauthorized: 'Non autorisÃ©', notFound: 'Non trouvÃ©', serverError: 'Erreur serveur' },
  },
};

class I18n {
  private language: Language = 'en';

  constructor() {
    if (typeof window !== 'undefined') {
      this.language = (localStorage.getItem('language') as Language) || 'en';
    }
  }

  t(key: string): string {
    const keys = key.split('.');
    let value: any = translations[this.language];
    for (const k of keys) {
      value = value?.[k];
    }
    if (value === undefined) {
      value = translations['en'];
      for (const k of keys) {
        value = value?.[k];
      }
    }
    return value || key;
  }

  setLanguage(lang: Language): void {
    this.language = lang;
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
    }
  }

  getLanguage(): Language {
    return this.language;
  }
}

export const i18n = new I18n();
