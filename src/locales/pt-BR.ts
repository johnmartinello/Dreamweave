export const ptBR = {
  // Navigation
  home: 'Início',
  connections: 'Conexões',
  categories: 'Categorias',
  
  // Common actions
  save: 'Salvar',
  cancel: 'Cancelar',
  delete: 'Excluir',
  edit: 'Editar',
  add: 'Adicionar',
  back: 'Voltar',
  close: 'Fechar',
  confirm: 'Confirmar',
  reject: 'Rejeitar',
  restore: 'Restaurar',
  clear: 'Limpar',
  search: 'Pesquisar',
  
  // Dream related
  dream: 'Sonho',
  dreams: 'Sonhos',
  dreamTitle: 'Título do sonho',
  dreamContent: 'Conteúdo do sonho',
  dreamDate: 'Data do sonho',
  dreamNotFound: 'Sonho não encontrado',
  backToDreams: 'Voltar aos Sonhos',
  describeYourDream: 'Descreva seu sonho em detalhes... Deixe seus pensamentos fluírem naturalmente... use @ para citar sonhos',
  addCategory: 'Adicionar Categoria...',
  category: 'Categoria',
  subcategory: 'Subcategoria',
  noTagsYet: 'Nenhuma tag ainda',
  
  // Category translations
  categoryNames: {
    emotions: 'Emoções e Humores',
    characters: 'Personagens e Seres',
    places: 'Lugares e Ambientes',
    actions: 'Ações e Eventos',
    objects: 'Objetos e Itens',
    dreamTypes: 'Tipos e Estilos de Sonho',
    uncategorized: 'Sem categoria',
  },
  
  // Subcategory translations
  subcategories: {
    // Emotions
    positive: 'Positivo',
    negative: 'Negativo',
    complexStates: 'Estados Complexos',
    
    // Characters
    people: 'Pessoas',
    animals: 'Animais',
    mythicalSpiritual: 'Mítico/Espiritual',
    deceasedMemoryFigures: 'Falecidos/Figuras da Memória',
    
    // Places
    naturalSettings: 'Ambientes Naturais',
    urbanManmade: 'Urbano/Construído',
    cosmicUnreal: 'Cósmico/Irreal',
    weatherAtmosphere: 'Clima/Atmosfera',
    
    // Actions
    movement: 'Movimento',
    interactions: 'Interações',
    transformations: 'Transformações',
    unusualEvents: 'Eventos Incomuns',
    
    // Objects
    everydayObjects: 'Objetos Cotidianos',
    mysticalUnrealItems: 'Itens Místicos/Irreais',
    technologyMachines: 'Tecnologia/Máquinas',
    symbolsSigns: 'Símbolos/Sinais',
    
    // Dream Types
    lucidity: 'Lucidez',
    tone: 'Tom',
    purposeMeaning: 'Propósito/Significado',
    physicalState: 'Estado Físico',
  },
  tagsWillAppear: 'As tags aparecerão aqui conforme você as adicionar',
  noNewTags: 'Nenhuma nova tag foi gerada',
  noTitleGenerated: 'Nenhum título foi gerado',
  pleaseAddContent: 'Por favor, adicione algum conteúdo do sonho primeiro',
  
  // AI Features
  aiFeatures: 'Recursos de IA',
  aiFeaturesDescription: 'Habilitar Recursos de IA',
  enableAI: 'Habilitar Recursos de IA',
  aiProvider: 'Provedor de IA',
  chooseAI: 'Escolha seu serviço de IA',
  gemini: 'Gemini',
  geminiDescription: 'IA baseada em nuvem do Google',
  lmStudio: 'LM Studio',
  lmStudioDescription: 'Modelos de IA locais',
  suggestions: 'Sugestões',
  thinking: 'Pensando...',
  suggestion: 'Sugestão',
  
  // AI Instructions
  geminiInstructions: {
    title: 'Google Gemini',
    description: 'Use a IA Gemini do Google para geração automática de categorias',
    steps: [
      '1. Visite o Google AI Studio (https://aistudio.google.com/)',
      '2. Faça login e clique em "Get API Key"',
      '3. Copie sua chave de API e cole abaixo',
      '4. Digite o nome do seu modelo preferido (ex: gemini-2.0-flash)'
    ]
  },
  lmStudioInstructions: {
    title: 'LM Studio',
    description: 'Use modelos locais através do LM Studio para privacidade',
    steps: [
      '1. Baixe e instale o LM Studio',
      '2. Carregue seu modelo preferido',
      '3. Inicie o servidor local (geralmente roda em localhost:1234)',
      '4. Digite a URL do endpoint de conclusão',
      '5. Digite o nome do seu modelo conforme configurado no LM Studio'
    ]
  },
  
  // Configuration
  configurations: 'Configurações',
  apiConfiguration: 'Configuração da API',
  setupCredentials: 'Configure suas credenciais de API',
  apiKey: 'Chave da API',
  modelName: 'Nome do Modelo',
  completionEndpoint: 'Endpoint de Conclusão',
  enterGeminiKey: 'Digite sua chave de API do Gemini',
  enterModelName: 'ex: gemini-2.0-flash',
  enterEndpoint: 'ex: http://localhost:1234/v1/chat/completions',
  enterLocalModel: 'ex: modelo-local',
  saveConfiguration: 'Salvar Configuração',
  saving: 'Salvando...',
  
  // Lockscreen
  lockscreen: 'Tela de Bloqueio',
  password: 'Senha',
  setPassword: 'Definir Senha',
  enterPassword: 'Digite a senha',
  confirmPassword: 'Confirmar senha',
  passwordsDoNotMatch: 'As senhas não coincidem',
  passwordSet: 'Senha definida com sucesso',
  passwordRemoved: 'Senha removida com sucesso',
  wrongPassword: 'Senha incorreta',
  unlock: 'Desbloquear',
  welcomeToDreamWeave: 'Bem-vindo ao DreamWeave',
  createPasswordToProtect: 'Crie uma senha para proteger seus sonhos',
  enterPasswordToContinue: 'Digite sua senha para continuar',
  creating: 'Criando...',
  unlocking: 'Desbloqueando...',
  createPassword: 'Criar Senha',
  noPasswordRecovery: 'Importante: Não há opção de recuperação de senha. Se você esquecer sua senha, precisará redefinir os dados do aplicativo.',
  lockscreenOptions: 'Opções de Tela de Bloqueio',
  configureLockscreen: 'Configure suas definições da tela de bloqueio',
  autoLockTimeout: 'Tempo limite de bloqueio automático (minutos)',
  autoLockDescription: 'O aplicativo será bloqueado automaticamente após este número de minutos de inatividade (1-60 minutos)',
  currentStatus: 'Status Atual',
  autoLockCurrent: 'Bloqueio automático: {timeout} minutos',
  saveSettings: 'Salvar Configurações',
  
  // Trash
  trash: 'Lixeira',
  trashedDreams: 'Sonhos na Lixeira',
  permanentlyDelete: 'Excluir Permanentemente',
  clearTrash: 'Limpar Lixeira',
  restoreDream: 'Restaurar Sonho',
  deleteDream: 'Excluir Sonho',
  deleteDreamConfirm: 'Tem certeza de que deseja excluir "{title}"? Esta ação o moverá para a lixeira.',
  
  // Citations
  citations: 'Citações',
  dreamCitations: 'Citações de Sonhos',
  citedDreams: 'Sonhos Citados',
  dreamsThatCite: 'Sonhos que citam este sonho',
  searchDreamsToCite: 'Pesquisar sonhos para citar...',
  noDreamsFound: 'Nenhum sonho encontrado',
  noDreamsAvailable: 'Nenhum sonho disponível para citar',
  addCitation: 'Adicionar Citação',
  removeCitation: 'Remover Citação',
  dreamPreview: 'Prévia do Sonho',
  
  // Date picker
  today: 'Hoje',
  months: [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ],
  weekdays: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
  
  // AI Tag suggestions
  categorySuggestions: 'Sugestões de Categorias',
  addNewTag: 'Adicionar uma nova tag...',
  addNewTagPlaceholder: 'Adicionar uma nova tag...',
  noTagsSuggested: 'Nenhuma tag sugerida ainda',
  addTagsManually: 'Adicione tags manualmente acima',
  addTags: 'Adicionar {count} Tag{plural}',
  
  // AI Title suggestions
  aiTitleSuggestion: 'Sugestão de Título do sistema',
  aiSuggestsTitle: 'O sistema sugere este título para seu sonho:',
  useThisTitle: 'Usar Este Título',
  tryDifferentTitle: 'Tentar Título Diferente',
  
  // Auto-save
  savingChanges: 'Salvando alterações...',
  allChangesSaved: 'Todas as alterações são salvas automaticamente',
  
  // Errors
  aiDisabled: 'IA está desabilitada',
  geminiRequiresKey: 'Gemini requer chave de API e nome do modelo',
  lmStudioRequiresEndpoint: 'LM Studio requer endpoint e nome do modelo',
  unsupportedProvider: 'Provedor de IA não suportado',
  failedToGenerateTags: 'Falha ao gerar tags com IA',
  failedToGenerateTitle: 'Falha ao gerar título com IA',
  failedToConnectGemini: 'Falha ao conectar com a API do Gemini',
  failedToConnectLMStudio: 'Falha ao conectar com a API do LM Studio',
  noResponseFromAI: 'Nenhuma resposta da IA',
  
  // Footer
  dreamsStoredLocally: 'Seus sonhos são armazenados localmente',
  
  // Language
  language: 'Idioma',
  english: 'Inglês',
  portuguese: 'Português (Brasil)',
  choosePreferredLanguage: 'Escolha seu idioma preferido',

  // Graph/Connections
  filters: 'Filtros',
  tags: 'Tags',
  searchDreams: 'Pesquisar Sonhos',
  searchDreamTitles: 'Pesquisar títulos de sonhos...',
  controls: 'Controles',
  centerView: 'Centralizar Visualização',
  showIsolated: 'Mostrar Isolados',
  hideIsolated: 'Ocultar Isolados',
  noDreamsToDisplay: 'Nenhum Sonho para Exibir',
  tryAdjustingFilters: 'Tente ajustar seus filtros para ver mais sonhos.',
  createDreamsAndCitations: 'Crie alguns sonhos e adicione citações para ver conexões.',
  nodes: 'Nós',
  size: 'Tamanho',
  clickToViewDetails: 'Clique para ver detalhes',
  
  // Layout
  layout: 'Layout',
  force: 'Força',
  circular: 'Circular',
  hierarchical: 'Hierárquico',
  
  // Date Range
  dateRange: 'Intervalo de Datas',
  startDate: 'Data de Início',
  endDate: 'Data de Fim',
  selectedTags: 'Tags Selecionadas',
  clearFilters: 'Limpar Filtros',
  
  // Placeholders
  searchPlaceholder: 'Pesquisar sonhos...',
  titlePlaceholder: 'Título do sonho...',
  contentPlaceholder: 'Descreva seu sonho em detalhes...',
  tagPlaceholder: 'Adicionar Categoria...',
  newTagPlaceholder: 'Adicionar uma nova tag...',
  
  // Status messages
  loading: 'Carregando...',
  error: 'Erro',
  success: 'Sucesso',
  warning: 'Aviso',
  info: 'Informação',
  
  // Notifications
  dreamCreated: 'Sonho criado com sucesso',
  dreamUpdated: 'Sonho atualizado com sucesso',
  dreamDeleted: 'Sonho movido para a lixeira',
  dreamRestored: 'Sonho restaurado com sucesso',
  dreamPermanentlyDeleted: 'Sonho excluído permanentemente',
  trashCleared: 'Lixeira limpa',
  configurationSaved: 'Configuração salva com sucesso',
  passwordChanged: 'Senha alterada com sucesso',
  languageChanged: 'Idioma alterado com sucesso',
  
  // Validation
  titleRequired: 'Título é obrigatório',
  contentRequired: 'Conteúdo é obrigatório',
  dateRequired: 'Data é obrigatória',
  passwordRequired: 'Senha é obrigatória',
  passwordMinLength: 'Senha deve ter pelo menos 4 caracteres',
  passwordMaxLength: 'Senha deve ter no máximo 20 caracteres',
  apiKeyRequired: 'Chave de API é obrigatória',
  modelNameRequired: 'Nome do modelo é obrigatório',
  endpointRequired: 'Endpoint é obrigatório',
  
  // Empty states
  noDreams: 'Nenhum sonho ainda',
  createFirstDream: 'Crie seu primeiro sonho para começar',
  noResults: 'Nenhum resultado encontrado',
  tryDifferentSearch: 'Tente um termo de pesquisa diferente',
  noCitations: 'Nenhuma citação ainda',
  addCitations: 'Adicione citações para conectar seus sonhos',
  
  // Tooltips
  addDream: 'Adicionar novo sonho',
  editDream: 'Editar sonho',
  addTag: 'Adicionar tag',
  removeTag: 'Remover tag',
  generateTags: 'Gerar tags com IA',
  generateTitle: 'Gerar título com IA',
  filterByDate: 'Filtrar por data',
  filterByTag: 'Filtrar por tag',
  settings: 'Configurações',
  lock: 'Bloquear',
  
  // Accessibility
  closeModal: 'Fechar modal',
  openModal: 'Abrir modal',
  toggleMenu: 'Alternar menu',
  selectOption: 'Selecionar opção',
  clearSelection: 'Limpar seleção',
  loadingContent: 'Carregando conteúdo...',
  errorOccurred: 'Ocorreu um erro',
  retry: 'Tentar novamente',
  
  // Time
  justNow: 'Agora mesmo',
  minutesAgo: 'há {count} minuto{plural}',
  hoursAgo: 'há {count} hora{plural}',
  daysAgo: 'há {count} dia{plural}',
  weeksAgo: 'há {count} semana{plural}',
  monthsAgo: 'há {count} mês{plural}',
  yearsAgo: 'há {count} ano{plural}',
  
  // Formatting
  dateFormat: 'dd/MM/yyyy',
  timeFormat: 'HH:mm',
  dateTimeFormat: 'dd/MM/yyyy HH:mm',
  
  // Pluralization
  plural: {
    minute: ['minuto', 'minutos'],
    hour: ['hora', 'horas'],
    day: ['dia', 'dias'],
    week: ['semana', 'semanas'],
    month: ['mês', 'meses'],
    year: ['ano', 'anos'],
    tag: ['tag', 'tags'],
    dream: ['sonho', 'sonhos'],
    citation: ['citação', 'citações']
  }
};
