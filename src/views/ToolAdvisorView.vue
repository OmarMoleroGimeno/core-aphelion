<script setup>
import { ref, computed, nextTick, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import Button from 'primevue/button';
import ScrollPanel from 'primevue/scrollpanel';
import MessageInput from '@/components/MessageInput.vue';
import { equipment } from '@/data/equipment_data';

// Utilities
const router = useRouter();

// State
const messages = ref([]);
const suggestions = ref([]);
const loading = ref(false);
const scrollPanelRef = ref(null);

// Initial suggestions
const INITIAL_SUGGESTIONS = [
    "Picar pared",
    "Cortar madera",
    "Lijar piscina",
    "Limpiar tapicería",
    "Hacer taladro en hormigón"
];

const scrollToBottom = async () => {
    await nextTick();
    const content = scrollPanelRef.value?.$el?.querySelector('.p-scrollpanel-content');
    if (content) {
        content.scrollTo({ top: content.scrollHeight, behavior: 'smooth' });
    }
};

watch(() => suggestions.value, () => {
    scrollToBottom();
});

const addMessage = (role, content, type = 'text', data = null) => {
    messages.value.push({
        id: Date.now(),
        role,
        content,
        type,
        data,
        timestamp: new Date()
    });
    scrollToBottom();
};

const initChat = () => {
    addMessage('bot', "¡Hola! Soy tu asistente de maquinaria. Cuéntame, ¿qué trabajo necesitas realizar hoy?", 'text');
    suggestions.value = INITIAL_SUGGESTIONS;
};

// Search Logic
const lastSearchContext = ref({
    active: false,
    candidates: [],
    stage: 'initial' // 'initial', 'refining'
});

const searchTools = (query, context = null) => {
    // 1. Tokenize & Detect Negations
    const rawParts = query.toLowerCase().replace(/[?,.;]/g, '').split(/\s+/);
    const positiveTokens = [];
    const negativeTokens = [];
    const skipWords = ['quiero', 'necesito', 'deseo', 'es', 'son', 'la', 'los', 'las', 'el', 'entre', 'para', 'un', 'una', 'en']; 

    // Semantic Expansion Map
    const semanticMap = {
        'agujero': ['perforadora', 'taladro', 'ahoyadora', 'broca'],
        'hueco': ['perforadora', 'taladro', 'ahoyadora'],
        'cortar': ['sierra', 'radial', 'cortadora', 'caladora'],
        'romper': ['martillo', 'picar'],
        'picar': ['martillo'],
        'suelo': ['pavimento', 'hormigon', 'tierra'],
        'baño': ['fontaneria', 'tuberias', 'desague', 'hormigon'],
        'desague': ['fontaneria', 'tuberias', 'hormigon'],
    };

    for (let i = 0; i < rawParts.length; i++) {
        const word = rawParts[i];
        
        // Detect Negation Markers
        if (['no', 'sin', 'menos', 'excepto'].includes(word)) {
            if (i + 1 < rawParts.length) {
                let next = rawParts[i+1];
                let nextIndex = i + 1;
                
                // Skip filler verbs
                if (skipWords.includes(next) && i + 2 < rawParts.length) {
                    next = rawParts[i+2];
                    nextIndex = i + 2;
                }
                
                if (next.length > 2) {
                    negativeTokens.push(next);
                    i = nextIndex; 
                    continue;
                }
            }
        }
        
        // Normal Token & Expansion
        if (word.length > 2 && !['pero', 'con', 'que', 'y', 'o'].includes(word)) {
            positiveTokens.push(word);
            // Inject synonyms
            if (semanticMap[word]) {
                positiveTokens.push(...semanticMap[word]);
            }
        }
    }
    
    if (positiveTokens.length === 0 && negativeTokens.length === 0) return [];

    let scope = (context && context.active && context.candidates.length > 0) 
        ? context.candidates 
        : equipment.flatMap(cat => cat.items.map(item => ({ ...item, category: cat.category })));
    
    const scoreItem = (item) => {
        let score = 0;
        const text = `${item.name} ${item.description} ${item.category}`.toLowerCase();
        const keywords = item.keywords.map(k => k.toLowerCase());
        
        // 1. Check Negatives
        for (const neg of negativeTokens) {
            if (keywords.includes(neg) || text.includes(neg)) {
                return -1000; 
            }
        }

        // 2. Check Positives
        positiveTokens.forEach(token => {
            let matched = false;
            // High priority: Keyword match 
            if (keywords.some(k => k === token || k.includes(token) || token.includes(k))) {
                score += 10; 
                matched = true;
            }
            
            // Medium: Name match
            if (item.name.toLowerCase().includes(token) || token.includes(item.name.toLowerCase())) {
                score += 5; // Boost name match slightly
                matched = true;
            }

            // Low: Description match
            if (text.includes(token) && !matched) {
                score += 2; // Increase description weight slightly to catch non-keyword hints
            }
        });
        
        return score;
    };

    let scored = scope.map(item => ({ item, score: scoreItem(item) })).filter(r => r.score > 0);
    
    // Fallback to Global
    if (scored.length === 0 && context && context.active) {
         const globalScope = equipment.flatMap(cat => cat.items.map(item => ({ ...item, category: cat.category })));
         scored = globalScope.map(item => ({ item, score: scoreItem(item) })).filter(r => r.score > 0);
    }

    // Dynamic Thresholding: Filter out weak matches
    // Calculate max score found
    if (scored.length > 0) {
        scored.sort((a, b) => b.score - a.score);
        const maxScore = scored[0].score;
        // Keep items that have at least 40% of the max score
        // This removes items that only matched 'suelo' (low score) vs items matching 'agujero'+'perforadora' (high score)
        const threshold = maxScore * 0.4; 
        scored = scored.filter(r => r.score >= threshold);
    }

    return scored.map(r => r.item);
};

// Interaction Logic
const handleUserResponse = async (text) => {
    loading.value = true;
    suggestions.value = []; 
    addMessage('user', text);

    setTimeout(() => {
        processQuery(text);
        loading.value = false;
    }, 800);
};

const processQuery = (text) => {
    const lowerText = text.toLowerCase();
    
    // Check for "Why/Specs" on single candidate
    if (lastSearchContext.value.active && lastSearchContext.value.candidates.length === 1) {
        const tool = lastSearchContext.value.candidates[0];
        
        if (lowerText.includes('por qué') || lowerText.includes('why') || lowerText.includes('razón')) {
            addMessage('bot', `Te recomiendo el **${tool.name}** porque sus características encajan con tu descripción.`);
            addMessage('bot', `Destaca por: ${tool.description}`);
            return;
        }

        if (lowerText.includes('spec') || lowerText.includes('característica') || lowerText.includes('técnica')) {
            addMessage('bot', `Aquí tienes las especificaciones técnicas del **${tool.name}**:`);
            const specs = Object.entries(tool.specs).map(([k, v]) => `- **${k}**: ${v}`).join('\n');
            addMessage('bot', specs || "No tengo especificaciones técnicas adicionales.");
            return;
        }
    }

    // Check for "Better/Comparison" intent
    const isComparison = lowerText.includes('diferencia') || lowerText.includes('vs') || (lowerText.includes('cuál') && lowerText.includes('mejor')) || lowerText.includes('compar');

    // PRIORITIZE CONTEXT FOR COMPARISON
    if (isComparison && lastSearchContext.value.active && lastSearchContext.value.candidates.length > 1) {
        handleComparison(text, lastSearchContext.value.candidates);
        return;
    }

    // Perform Search (Context-aware or Fresh)
    let results = [];
    if (lastSearchContext.value.active && !isComparison) {
         results = searchTools(text, lastSearchContext.value);
    } else {
         results = searchTools(text);
    }

    // Handle No Results
    if (results.length === 0) {
        addMessage('bot', "No he encontrado ninguna herramienta que coincida. ¿Podrías intentar describirlo de otra forma?");
        suggestions.value = ["Taladrar", "Cortar", "Lijar", "Diferencia Martillo y Taladro"];
        lastSearchContext.value = { active: false, candidates: [], stage: 'initial' };
        return;
    }

    // Handle Comparison Explicitly (Fresh search yielded multiple results)
    if (isComparison && results.length > 0) {
        handleComparison(text, results);
        return;
    }

    // Single Result
    if (results.length === 1) {
        const tool = results[0];
        addMessage('bot', `Creo que la mejor opción es el **${tool.name}**.`, 'tool-card', tool);
        addMessage('bot', `Es ideal para: ${tool.description}`);
        suggestions.value = ["Buscar otra cosa", "Ver especificaciones", "¿Por qué esta?"];
        lastSearchContext.value = { active: true, candidates: [tool], stage: 'initial' }; 
        return;
    }

    // Multiple Results Flow
    lastSearchContext.value = {
        active: true,
        candidates: results,
        stage: 'refining'
    };

    if (results.length > 5) {
        const categories = [...new Set(results.map(r => r.category))].slice(0, 3);
        const catStr = categories.join(", ");
        addMessage('bot', `He encontrado ${results.length} opciones (${catStr}...).`);
        addMessage('bot', "¿Podrías darme más detalles? (Ej: Material, profundidad, interior/exterior)");
        return;
    }

    const categories = [...new Set(results.map(r => r.category))];
    
    if (categories.length > 1) {
        addMessage('bot', `Tengo opciones en varias categorías: ${categories.join(', ')}. ¿Cuál prefieres?`);
        suggestions.value = categories.map(c => `Ver ${c}`);
        return;
    }

    const allKeywords = [...new Set(results.flatMap(r => r.keywords))];
    let bestDiscriminator = null;
    let bestScore = Infinity;

    for (const kw of allKeywords) {
        const count = results.filter(r => r.keywords.includes(kw)).length;
        if (count > 0 && count < results.length) {
            const score = Math.abs(count/results.length - 0.5);
            if (score < bestScore) {
                bestScore = score;
                bestDiscriminator = kw;
            }
        }
    }

    if (bestDiscriminator) {
        addMessage('bot', `¿El trabajo implica **${bestDiscriminator}**?`);
        suggestions.value = [`Sí, ${bestDiscriminator}`, `No, sin ${bestDiscriminator}`];
    } else {
        addMessage('bot', "Aquí tienes las mejores opciones:", 'tool-list', results);
        addMessage('bot', "¿Te interesa alguna o quieres comparar?");
    }
};

const handleComparison = (text, candidates) => {
    // 1. Check Category-level Comparison
    const categories = [...new Set(candidates.map(r => r.category))];
    
    if (categories.length > 1) {
        // Limit to top 3 categories to avoid flooding
        const displayCats = categories.slice(0, 3);
        
        addMessage('bot', `Diferencias entre categorías:`);
        
        displayCats.forEach(cat => {
            const rep = candidates.find(c => c.category === cat);
            const purpose = rep.description.split('.')[0]; 
            const commonKeywords = rep.keywords.slice(0, 3).join(', ');
            addMessage('bot', `- **${cat}**: ${purpose}. (Clave: ${commonKeywords})`);
        });
        
        addMessage('bot', "¿Cuál se ajusta más a tu necesidad?");
        suggestions.value = displayCats.map(c => `Ver ${c}`);
        return;
    }

    // 2. Specific Item Comparison
    const top2 = candidates.slice(0, 2);
    if (top2.length < 2) {
        addMessage('bot', `Solo tengo una opción principal aquí: ${top2[0].name}. ${top2[0].description}`);
        return;
    }
    
    const t1 = top2[0];
    const t2 = top2[1];
    
    addMessage('bot', `Entre **${t1.name}** y **${t2.name}**:`);
    addMessage('bot', `- **${t1.name}**: ${t1.description} (Consumo: ${t1.specs.consumo || 'N/A'})`);
    addMessage('bot', `- **${t2.name}**: ${t2.description} (Consumo: ${t2.specs.consumo || 'N/A'})`);
    
    if (t1.specs.consumo && t2.specs.consumo) {
        addMessage('bot', "Revisa la potencia si tienes limitaciones de luz.");
    }
};

onMounted(() => {
    initChat();
});

const goBack = () => router.push('/');

</script>

<template>
    <div class="flex flex-col h-screen w-full bg-light-bg dark:bg-[#131314] font-sans">
        <!-- Header -->
        <div class="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-800/50 bg-white/80 dark:bg-[#1E1E1E]/80 backdrop-blur-md z-10 shrink-0">
            <Button 
                icon="pi pi-arrow-left" 
                text 
                rounded 
                class="!text-gray-600 dark:!text-gray-300 hover:!bg-gray-100 dark:hover:!bg-gray-800"
                @click="goBack"
            />
            <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <i class="pi pi-compass text-lg text-white"></i>
                </div>
                <div class="flex flex-col">
                    <h2 class="font-semibold text-gray-900 dark:text-white text-sm md:text-base">Tool Advisor</h2>
                    <span class="text-xs text-gray-500 dark:text-gray-400">Asistente Inteligente</span>
                </div>
            </div>
        </div>

        <!-- Chat Area -->
        <div class="flex-1 min-h-0 relative bg-zinc-50 dark:bg-[#131314] px-8 pt-4">
            <ScrollPanel 
                ref="scrollPanelRef" 
                class="w-full h-full custom-scrollbar"
                :pt="{
                    wrapper: { class: 'h-full' },
                    content: { class: 'p-4 md:p-6 max-w-7xl mx-auto flex flex-col min-h-full' }
                }"
            >
                <!-- Messages -->
                <div class="flex-1 flex flex-col pb-20">
                    <div v-for="(msg, index) in messages" :key="msg.id" 
                         class="flex w-full" 
                         :class="[
                            msg.role === 'user' ? 'justify-end' : 'justify-start',
                            index > 0 && messages[index - 1].role === msg.role ? 'mt-1' : 'mt-6'
                         ]">
                        
                        <div class="flex flex-col max-w-[85%]" :class="msg.role === 'user' ? 'items-end' : 'items-start'">
                            <!-- Avatar/Name -->
                            <div class="flex items-center gap-2 mb-1 px-1" 
                                 v-if="msg.role === 'bot' && (index === 0 || messages[index - 1].role !== 'bot')">
                                <span class="text-xs font-bold text-indigo-600 dark:text-indigo-400">Asistente</span>
                            </div>
                            <div class="flex items-center gap-2 mb-1 px-1" 
                                 v-if="msg.role === 'user'">
                                <span class="text-xs text-zinc-400">Tú</span>
                            </div>

                            <!-- Bubble -->
                            <div 
                                class="px-5 py-3 rounded-2xl shadow-sm relative overflow-hidden"
                                :class="[
                                    msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200',
                                    (index === messages.length - 1 || messages[index + 1].role !== msg.role) 
                                        ? (msg.role === 'user' ? 'rounded-br-none' : 'rounded-bl-none')
                                        : ''
                                ]"
                            >
                                <!-- Text Content -->
                                <div v-if="msg.type === 'text'" v-html="msg.content.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>')"></div>

                                <!-- Tool Card -->
                                <div v-if="msg.type === 'tool-card'" class="mt-2 min-w-[250px]">
                                    <h3 class="font-bold text-lg mb-1 text-indigo-700 dark:text-indigo-400">{{ msg.data.name }}</h3>
                                    <div class="text-xs uppercase tracking-wider opacity-70 mb-2">{{ msg.data.category }}</div>
                                    <div class="bg-gray-50 dark:bg-black/20 rounded p-3 text-sm space-y-1 mb-2">
                                        <div v-for="(val, key) in msg.data.specs" :key="key" class="flex justify-between border-b border-gray-200 dark:border-gray-700/50 last:border-0 pb-1 last:pb-0">
                                            <span class="capitalize opacity-70">{{ key }}:</span>
                                            <span class="font-medium ml-2">{{ val }}</span>
                                        </div>
                                    </div>
                                    <div class="flex flex-wrap gap-1 mt-2">
                                        <span v-for="kw in msg.data.keywords.slice(0,4)" :key="kw" class="text-[10px] bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full">
                                            {{ kw }}
                                        </span>
                                    </div>
                                </div>

                                <!-- Tool List -->
                                <div v-if="msg.type === 'tool-list'" class="flex flex-col gap-2 mt-1">
                                    <div v-for="item in msg.data" :key="item.id" class="p-3 bg-gray-50 dark:bg-black/20 rounded-lg hover:bg-gray-100 dark:hover:bg-black/30 transition-colors cursor-pointer border border-transparent hover:border-indigo-200 dark:hover:border-indigo-800">
                                        <div class="font-bold text-sm">{{ item.name }}</div>
                                        <div class="text-xs opacity-70 truncate">{{ item.description }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Suggestions Area (In flow) -->
                    <div v-if="suggestions.length > 0 && !loading" class="flex flex-wrap gap-2 mt-2">
                        <button 
                            v-for="sug in suggestions" 
                            :key="sug"
                            @click="handleUserResponse(sug)"
                            class="bg-white dark:bg-zinc-800 hover:bg-indigo-50 dark:hover:bg-zinc-700 border border-indigo-100 dark:border-zinc-700 text-indigo-600 dark:text-indigo-400 px-4 py-2 rounded-xl text-sm transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 text-left"
                        >
                            {{ sug }}
                        </button>
                    </div>

                    <!-- Loading -->
                    <div v-if="loading" class="flex justify-start">
                        <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2">
                            <div class="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></div>
                            <div class="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-75"></div>
                            <div class="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-150"></div>
                        </div>
                    </div>
                </div>
            </ScrollPanel>
        </div>

        <!-- Input Area -->
        <MessageInput 
            :loading="loading" 
            placeholder="Describe tu trabajo..."
            @send="handleUserResponse"
            class="shrink-0 z-20 shadow-[-5px]" 
        />
    </div>
</template>

<style scoped>
/* Custom Scrollbar for the list */
:deep(.p-scrollpanel-bar) {
    background-color: rgba(156, 163, 175, 0.3) !important;
}
</style>
