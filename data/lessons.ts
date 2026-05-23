import { Lesson } from '@/types/learning';

export const LESSONS: Lesson[] = [
  // ─── Spanish ───────────────────────────────────────────────────────────────

  {
    id: 'es-lesson-1',
    unitId: 'es-unit-1',
    title: 'Hola! Greetings',
    description: 'Learn how to say hello and goodbye in Spanish',
    icon: '👋',
    xpReward: 10,
    goals: [
      { description: 'Learn 5 greeting words', xpReward: 5 },
      { description: 'Complete all activities', xpReward: 5 },
    ],
    vocabulary: [
      { word: 'Hola', translation: 'Hello', pronunciation: 'OH-lah', emoji: '👋' },
      { word: 'Adiós', translation: 'Goodbye', pronunciation: 'ah-DYOHS', emoji: '👋' },
      { word: 'Buenos días', translation: 'Good morning', pronunciation: 'BWEH-nohs DEE-ahs', emoji: '🌅' },
      { word: 'Buenas tardes', translation: 'Good afternoon', pronunciation: 'BWEH-nahs TAR-dehs', emoji: '☀️' },
      { word: 'Buenas noches', translation: 'Good night', pronunciation: 'BWEH-nahs NOH-chehs', emoji: '🌙' },
    ],
    phrases: [
      { text: '¿Cómo estás?', translation: 'How are you?', pronunciation: 'KOH-moh ehs-TAHS' },
      { text: 'Estoy bien, gracias.', translation: 'I am fine, thank you.', pronunciation: 'ehs-TOY BYEHN, GRAH-syahs' },
      { text: 'Mucho gusto.', translation: 'Nice to meet you.', pronunciation: 'MOO-choh GOOS-toh' },
    ],
    activities: [
      {
        id: 'es-lesson-1-act-1',
        type: 'multiple-choice',
        question: 'What does "Hola" mean?',
        correctAnswer: 'Hello',
        options: ['Hello', 'Goodbye', 'Thank you', 'Please'],
      },
      {
        id: 'es-lesson-1-act-2',
        type: 'multiple-choice',
        question: 'How do you say "Good morning" in Spanish?',
        correctAnswer: 'Buenos días',
        options: ['Buenas noches', 'Buenos días', 'Buenas tardes', 'Adiós'],
      },
      {
        id: 'es-lesson-1-act-3',
        type: 'translate',
        question: 'Translate: "Good night"',
        correctAnswer: 'Buenas noches',
        hint: 'Think about when you go to sleep.',
      },
      {
        id: 'es-lesson-1-act-4',
        type: 'multiple-choice',
        question: 'What does "¿Cómo estás?" mean?',
        correctAnswer: 'How are you?',
        options: ['How are you?', 'What is your name?', 'Where are you from?', 'Nice to meet you.'],
      },
    ],
    aiTeacherPrompt: {
      systemPrompt:
        "You're Luna, a warm, energetic Spanish teacher leading a live voice lesson on Spanish greetings. Stay only inside this lesson's greetings goal, vocabulary, phrases, and context. Mostly speak English, teach one greeting or phrase at a time, say the Spanish slowly, give the English meaning right away, and add a quick pronunciation cue when helpful. After the learner responds, react briefly, adapt, and either move to the next tiny step or ask them to try again. Keep every turn to one or two natural sentences with gentle encouragement. Do not switch to any other language.",
      introMessage:
        "Hi, I'm Luna. Today we'll practice a few simple Spanish greetings, and I'll help you say each one clearly.",
      topics: ['greetings', 'farewells', 'time-of-day phrases', 'asking how someone is'],
    },
  },

  {
    id: 'es-lesson-2',
    unitId: 'es-unit-1',
    title: 'Introductions',
    description: 'Introduce yourself and ask for names',
    icon: '🙋',
    xpReward: 10,
    goals: [
      { description: 'Learn how to say your name', xpReward: 5 },
      { description: 'Ask someone else\'s name', xpReward: 5 },
    ],
    vocabulary: [
      { word: 'Me llamo', translation: 'My name is', pronunciation: 'meh YAH-moh', emoji: '🙋' },
      { word: 'Soy', translation: 'I am', pronunciation: 'SOY', emoji: '👤' },
      { word: 'Nombre', translation: 'Name', pronunciation: 'NOHM-breh', emoji: '🏷️' },
      { word: 'De', translation: 'From', pronunciation: 'DEH', emoji: '📍' },
      { word: 'Encantado/a', translation: 'Pleased to meet you', pronunciation: 'ehn-kahn-TAH-doh', emoji: '😊' },
    ],
    phrases: [
      { text: '¿Cómo te llamas?', translation: 'What is your name?', pronunciation: 'KOH-moh teh YAH-mahs' },
      { text: 'Me llamo Ana.', translation: 'My name is Ana.', pronunciation: 'meh YAH-moh AH-nah' },
      { text: '¿De dónde eres?', translation: 'Where are you from?', pronunciation: 'deh DOHN-deh EH-rehs' },
      { text: 'Soy de México.', translation: 'I am from Mexico.', pronunciation: 'SOY deh MEH-hee-koh' },
    ],
    activities: [
      {
        id: 'es-lesson-2-act-1',
        type: 'multiple-choice',
        question: 'How do you say "My name is" in Spanish?',
        correctAnswer: 'Me llamo',
        options: ['Me llamo', 'Soy de', 'Cómo te', 'Encantado'],
      },
      {
        id: 'es-lesson-2-act-2',
        type: 'multiple-choice',
        question: 'What does "¿Cómo te llamas?" mean?',
        correctAnswer: 'What is your name?',
        options: ['What is your name?', 'How are you?', 'Where are you from?', 'Nice to meet you.'],
      },
      {
        id: 'es-lesson-2-act-3',
        type: 'translate',
        question: 'Translate: "Where are you from?"',
        correctAnswer: '¿De dónde eres?',
        hint: 'You use "dónde" for where.',
      },
    ],
    aiTeacherPrompt: {
      systemPrompt:
        "You're Luna, a warm, energetic Spanish teacher leading a live voice lesson on Spanish introductions. Stay only inside this lesson's goal, vocabulary, phrases, and context. Mostly speak English, teach one short phrase at a time, say the Spanish slowly, give the English meaning right away, and add a quick pronunciation cue when helpful. After the learner responds, react briefly, adapt, and either move to the next tiny step or ask them to try again. Keep every turn to one or two natural sentences with gentle encouragement. Do not switch to any other language.",
      introMessage:
        "Hi again, I'm Luna. Today we'll practice simple Spanish introductions, one short phrase at a time.",
      topics: ['introductions', 'saying your name', 'asking names', 'where you are from'],
    },
  },

  {
    id: 'es-lesson-3',
    unitId: 'es-unit-1',
    title: 'Numbers 1–10',
    description: 'Count from one to ten in Spanish',
    icon: '🔢',
    xpReward: 10,
    goals: [
      { description: 'Learn numbers 1 to 10', xpReward: 7 },
      { description: 'Complete all activities', xpReward: 3 },
    ],
    vocabulary: [
      { word: 'Uno', translation: '1 — One', pronunciation: 'OO-noh', emoji: '1️⃣' },
      { word: 'Dos', translation: '2 — Two', pronunciation: 'DOHS', emoji: '2️⃣' },
      { word: 'Tres', translation: '3 — Three', pronunciation: 'TREHS', emoji: '3️⃣' },
      { word: 'Cuatro', translation: '4 — Four', pronunciation: 'KWAH-troh', emoji: '4️⃣' },
      { word: 'Cinco', translation: '5 — Five', pronunciation: 'SEEN-koh', emoji: '5️⃣' },
      { word: 'Seis', translation: '6 — Six', pronunciation: 'SAYS', emoji: '6️⃣' },
      { word: 'Siete', translation: '7 — Seven', pronunciation: 'SYEH-teh', emoji: '7️⃣' },
      { word: 'Ocho', translation: '8 — Eight', pronunciation: 'OH-choh', emoji: '8️⃣' },
      { word: 'Nueve', translation: '9 — Nine', pronunciation: 'NWEH-beh', emoji: '9️⃣' },
      { word: 'Diez', translation: '10 — Ten', pronunciation: 'DYEHS', emoji: '🔟' },
    ],
    phrases: [
      { text: '¿Cuántos son?', translation: 'How many are there?', pronunciation: 'KWAHN-tohs SOHN' },
      { text: 'Son cinco.', translation: 'There are five.', pronunciation: 'SOHN SEEN-koh' },
    ],
    activities: [
      {
        id: 'es-lesson-3-act-1',
        type: 'multiple-choice',
        question: 'What is "cinco" in English?',
        correctAnswer: 'Five',
        options: ['Three', 'Four', 'Five', 'Six'],
      },
      {
        id: 'es-lesson-3-act-2',
        type: 'multiple-choice',
        question: 'How do you say "eight" in Spanish?',
        correctAnswer: 'Ocho',
        options: ['Siete', 'Nueve', 'Ocho', 'Seis'],
      },
      {
        id: 'es-lesson-3-act-3',
        type: 'translate',
        question: 'Translate: "Ten"',
        correctAnswer: 'Diez',
        hint: 'It sounds like "dyehs".',
      },
    ],
    aiTeacherPrompt: {
      systemPrompt:
        "You're Luna, a warm, energetic Spanish teacher leading a live voice lesson on Spanish numbers one through ten. Stay only inside this lesson's counting goal, vocabulary, phrases, and context. Mostly speak English, teach one number or counting phrase at a time, say the Spanish slowly, give the English meaning right away, and add a quick pronunciation cue when helpful. After the learner responds, react briefly, adapt, and either move to the next tiny step or ask them to try again. Keep every turn to one or two natural sentences with gentle encouragement. Do not switch to any other language.",
      introMessage:
        "Hi, I'm Luna. Today we'll count from one to ten in Spanish, and we'll take it nice and slow.",
      topics: ['numbers 1-10', 'counting', 'how many'],
    },
  },

  // ─── French ────────────────────────────────────────────────────────────────

  {
    id: 'fr-lesson-1',
    unitId: 'fr-unit-1',
    title: 'Bonjour! Greetings',
    description: 'Learn everyday French greetings',
    icon: '👋',
    xpReward: 10,
    goals: [
      { description: 'Learn 5 French greetings', xpReward: 5 },
      { description: 'Complete all activities', xpReward: 5 },
    ],
    vocabulary: [
      { word: 'Bonjour', translation: 'Hello / Good day', pronunciation: 'bohn-ZHOOR', emoji: '☀️' },
      { word: 'Bonsoir', translation: 'Good evening', pronunciation: 'bohn-SWAHR', emoji: '🌙' },
      { word: 'Au revoir', translation: 'Goodbye', pronunciation: 'oh ruh-VWAHR', emoji: '👋' },
      { word: 'Salut', translation: 'Hi (informal)', pronunciation: 'sah-LÜ', emoji: '🙋' },
      { word: 'Merci', translation: 'Thank you', pronunciation: 'mehr-SEE', emoji: '🙏' },
    ],
    phrases: [
      { text: 'Comment allez-vous ?', translation: 'How are you? (formal)', pronunciation: 'koh-MAHN tah-lay-VOO' },
      { text: 'Ça va bien, merci.', translation: 'I\'m doing well, thank you.', pronunciation: 'sah VAH BYAHN, mehr-SEE' },
      { text: 'Enchanté(e).', translation: 'Nice to meet you.', pronunciation: 'ahn-shahn-TAY' },
    ],
    activities: [
      {
        id: 'fr-lesson-1-act-1',
        type: 'multiple-choice',
        question: 'What does "Bonjour" mean?',
        correctAnswer: 'Hello / Good day',
        options: ['Hello / Good day', 'Goodbye', 'Good evening', 'Thank you'],
      },
      {
        id: 'fr-lesson-1-act-2',
        type: 'multiple-choice',
        question: 'How do you say "Goodbye" in French?',
        correctAnswer: 'Au revoir',
        options: ['Bonjour', 'Salut', 'Au revoir', 'Merci'],
      },
      {
        id: 'fr-lesson-1-act-3',
        type: 'translate',
        question: 'Translate: "Thank you"',
        correctAnswer: 'Merci',
        hint: 'It ends with "-ci".',
      },
    ],
    aiTeacherPrompt: {
      systemPrompt:
        "You're Claire, a warm, energetic French teacher leading a live voice lesson on French greetings. Stay only inside this lesson's greetings goal, vocabulary, phrases, and context. Mostly speak English, teach one greeting or phrase at a time, say the French slowly, give the English meaning right away, and add a quick pronunciation cue when helpful. After the learner responds, react briefly, adapt, and either move to the next tiny step or ask them to try again. Keep every turn to one or two natural sentences with gentle encouragement. Do not switch to any other language.",
      introMessage:
        "Hi, I'm Claire. Today we'll practice a few everyday French greetings, and I'll help you say them naturally.",
      topics: ['greetings', 'farewells', 'politeness expressions', 'asking how someone is'],
    },
  },

  {
    id: 'fr-lesson-2',
    unitId: 'fr-unit-1',
    title: 'Introductions',
    description: 'Say your name and learn about others in French',
    icon: '🙋',
    xpReward: 10,
    goals: [
      { description: 'Say your name in French', xpReward: 5 },
      { description: 'Ask for someone\'s name', xpReward: 5 },
    ],
    vocabulary: [
      { word: 'Je m\'appelle', translation: 'My name is', pronunciation: 'zhuh mah-PELL', emoji: '🙋' },
      { word: 'Je suis', translation: 'I am', pronunciation: 'zhuh SWEE', emoji: '👤' },
      { word: 'De', translation: 'From', pronunciation: 'duh', emoji: '📍' },
      { word: 'Français(e)', translation: 'French', pronunciation: 'frahn-SAY', emoji: '🇫🇷' },
      { word: 'Enchanté(e)', translation: 'Pleased to meet you', pronunciation: 'ahn-shahn-TAY', emoji: '😊' },
    ],
    phrases: [
      { text: 'Comment vous appelez-vous ?', translation: 'What is your name? (formal)', pronunciation: 'koh-MAHN voo zah-play-VOO' },
      { text: 'Je m\'appelle Marie.', translation: 'My name is Marie.', pronunciation: 'zhuh mah-PELL mah-REE' },
      { text: 'D\'où venez-vous ?', translation: 'Where are you from?', pronunciation: 'doo vuh-nay-VOO' },
    ],
    activities: [
      {
        id: 'fr-lesson-2-act-1',
        type: 'multiple-choice',
        question: 'How do you say "My name is" in French?',
        correctAnswer: 'Je m\'appelle',
        options: ['Je suis', 'Je m\'appelle', 'Comment vous', 'D\'où venez'],
      },
      {
        id: 'fr-lesson-2-act-2',
        type: 'translate',
        question: 'Translate: "Where are you from?"',
        correctAnswer: 'D\'où venez-vous ?',
        hint: 'Starts with "D\'où".',
      },
    ],
    aiTeacherPrompt: {
      systemPrompt:
        "You're Claire, a warm, energetic French teacher leading a live voice lesson on French introductions. Stay only inside this lesson's goal, vocabulary, phrases, and context. Mostly speak English, teach one short phrase at a time, say the French slowly, give the English meaning right away, and add a quick pronunciation cue when helpful. After the learner responds, react briefly, adapt, and either move to the next tiny step or ask them to try again. Keep every turn to one or two natural sentences with gentle encouragement. Do not switch to any other language.",
      introMessage:
        "Hi, I'm Claire. Today we'll practice simple French introductions, one short phrase at a time.",
      topics: ['introductions', 'saying your name', 'asking names', 'where you are from'],
    },
  },

  // ─── Japanese ──────────────────────────────────────────────────────────────

  {
    id: 'ja-lesson-1',
    unitId: 'ja-unit-1',
    title: 'こんにちは — Greetings',
    description: 'Learn essential Japanese greetings',
    icon: '🎌',
    xpReward: 10,
    goals: [
      { description: 'Learn 5 Japanese greetings', xpReward: 5 },
      { description: 'Complete all activities', xpReward: 5 },
    ],
    vocabulary: [
      { word: 'こんにちは', translation: 'Hello', pronunciation: 'kon-ni-chi-wa', emoji: '👋' },
      { word: 'おはようございます', translation: 'Good morning', pronunciation: 'o-ha-yo go-zai-mas', emoji: '🌅' },
      { word: 'こんばんは', translation: 'Good evening', pronunciation: 'kon-ban-wa', emoji: '🌙' },
      { word: 'さようなら', translation: 'Goodbye', pronunciation: 'sa-yo-na-ra', emoji: '👋' },
      { word: 'ありがとう', translation: 'Thank you', pronunciation: 'a-ri-ga-to', emoji: '🙏' },
    ],
    phrases: [
      { text: 'お元気ですか？', translation: 'How are you?', pronunciation: 'o-gen-ki des-ka' },
      { text: '元気です、ありがとう。', translation: 'I\'m fine, thank you.', pronunciation: 'gen-ki des, a-ri-ga-to' },
      { text: 'はじめまして。', translation: 'Nice to meet you.', pronunciation: 'ha-ji-me-ma-shi-te' },
    ],
    activities: [
      {
        id: 'ja-lesson-1-act-1',
        type: 'multiple-choice',
        question: 'What does "こんにちは" mean?',
        correctAnswer: 'Hello',
        options: ['Hello', 'Goodbye', 'Good morning', 'Thank you'],
      },
      {
        id: 'ja-lesson-1-act-2',
        type: 'multiple-choice',
        question: 'How do you say "Good morning" in Japanese?',
        correctAnswer: 'おはようございます',
        options: ['こんにちは', 'おはようございます', 'こんばんは', 'さようなら'],
      },
      {
        id: 'ja-lesson-1-act-3',
        type: 'translate',
        question: 'Translate: "Thank you"',
        correctAnswer: 'ありがとう',
        hint: 'Pronounced "a-ri-ga-to".',
      },
    ],
    aiTeacherPrompt: {
      systemPrompt:
        "You're Yuki, a warm, energetic Japanese teacher leading a live voice lesson on Japanese greetings. Stay only inside this lesson's greetings goal, vocabulary, phrases, and context. Mostly speak English, teach one greeting or phrase at a time, say the Japanese slowly, give the English meaning right away, and add a simple pronunciation cue when helpful. After the learner responds, react briefly, adapt, and either move to the next tiny step or ask them to try again. Keep every turn to one or two natural sentences with gentle encouragement. Do not switch to any other language.",
      introMessage:
        "Hi, I'm Yuki. Today we'll practice a few essential Japanese greetings, and we'll take the sounds one step at a time.",
      topics: ['greetings', 'farewells', 'politeness', 'time-of-day phrases'],
    },
  },

  {
    id: 'ja-lesson-2',
    unitId: 'ja-unit-1',
    title: 'Self Introduction',
    description: 'Introduce yourself in Japanese',
    icon: '🙋',
    xpReward: 10,
    goals: [
      { description: 'Say your name in Japanese', xpReward: 5 },
      { description: 'Complete all activities', xpReward: 5 },
    ],
    vocabulary: [
      { word: 'わたしは', translation: 'I am / As for me', pronunciation: 'wa-ta-shi-wa', emoji: '👤' },
      { word: 'なまえ', translation: 'Name', pronunciation: 'na-ma-e', emoji: '🏷️' },
      { word: 'です', translation: 'Am / Is / Are (polite)', pronunciation: 'des', emoji: '✅' },
      { word: 'どうぞよろしく', translation: 'Please treat me well', pronunciation: 'do-zo yo-ro-shi-ku', emoji: '🤝' },
      { word: 'から来ました', translation: 'I came from', pronunciation: 'ka-ra ki-ma-shi-ta', emoji: '📍' },
    ],
    phrases: [
      { text: 'わたしは アナ です。', translation: 'I am Ana.', pronunciation: 'wa-ta-shi-wa A-na des' },
      { text: 'おなまえは？', translation: 'What is your name?', pronunciation: 'o-na-ma-e-wa' },
      { text: 'アメリカから来ました。', translation: 'I came from America.', pronunciation: 'A-me-ri-ka ka-ra ki-ma-shi-ta' },
    ],
    activities: [
      {
        id: 'ja-lesson-2-act-1',
        type: 'multiple-choice',
        question: 'How do you say "I am" in Japanese?',
        correctAnswer: 'わたしは',
        options: ['わたしは', 'なまえ', 'どうぞ', 'から'],
      },
      {
        id: 'ja-lesson-2-act-2',
        type: 'multiple-choice',
        question: 'What does "おなまえは？" mean?',
        correctAnswer: 'What is your name?',
        options: ['How are you?', 'Where are you from?', 'What is your name?', 'Nice to meet you.'],
      },
    ],
    aiTeacherPrompt: {
      systemPrompt:
        "You're Yuki, a warm, energetic Japanese teacher leading a live voice lesson on Japanese self-introductions. Stay only inside this lesson's goal, vocabulary, phrases, and context. Mostly speak English, teach one short pattern or phrase at a time, explain it simply, say the Japanese slowly, give the English meaning right away, and add a simple pronunciation cue when helpful. After the learner responds, react briefly, adapt, and either move to the next tiny step or ask them to try again. Keep every turn to one or two natural sentences with gentle encouragement. Do not switch to any other language.",
      introMessage:
        "Hi, I'm Yuki. Today we'll build a simple Japanese self-introduction pattern that you can use right away.",
      topics: ['self-introduction', 'saying your name', 'where you are from', 'polite expressions'],
    },
  },

  // ─── German ────────────────────────────────────────────────────────────────

  {
    id: 'de-lesson-1',
    unitId: 'de-unit-1',
    title: 'Hallo! Greetings',
    description: 'Learn how to greet people in German',
    icon: '👋',
    xpReward: 10,
    goals: [
      { description: 'Learn 5 German greetings', xpReward: 5 },
      { description: 'Complete all activities', xpReward: 5 },
    ],
    vocabulary: [
      { word: 'Hallo', translation: 'Hello', pronunciation: 'HAH-loh', emoji: '👋' },
      { word: 'Guten Morgen', translation: 'Good morning', pronunciation: 'GOO-ten MOR-gen', emoji: '🌅' },
      { word: 'Guten Abend', translation: 'Good evening', pronunciation: 'GOO-ten AH-bent', emoji: '🌙' },
      { word: 'Auf Wiedersehen', translation: 'Goodbye', pronunciation: 'owf VEE-der-zayn', emoji: '👋' },
      { word: 'Danke', translation: 'Thank you', pronunciation: 'DAHN-keh', emoji: '🙏' },
    ],
    phrases: [
      { text: 'Wie geht es Ihnen?', translation: 'How are you? (formal)', pronunciation: 'vee gayt es EE-nen' },
      { text: 'Mir geht es gut, danke.', translation: 'I\'m doing well, thank you.', pronunciation: 'meer gayt es GOOT, DAHN-keh' },
      { text: 'Schön, Sie kennenzulernen.', translation: 'Nice to meet you.', pronunciation: 'shern zee KEN-en-tsu-ler-nen' },
    ],
    activities: [
      {
        id: 'de-lesson-1-act-1',
        type: 'multiple-choice',
        question: 'What does "Guten Morgen" mean?',
        correctAnswer: 'Good morning',
        options: ['Good morning', 'Good evening', 'Goodbye', 'Hello'],
      },
      {
        id: 'de-lesson-1-act-2',
        type: 'multiple-choice',
        question: 'How do you say "Thank you" in German?',
        correctAnswer: 'Danke',
        options: ['Hallo', 'Bitte', 'Danke', 'Ja'],
      },
      {
        id: 'de-lesson-1-act-3',
        type: 'translate',
        question: 'Translate: "Goodbye"',
        correctAnswer: 'Auf Wiedersehen',
        hint: 'It literally means "until we see each other again".',
      },
    ],
    aiTeacherPrompt: {
      systemPrompt:
        "You're Max, a warm, energetic German teacher leading a live voice lesson on German greetings. Stay only inside this lesson's greetings goal, vocabulary, phrases, and context. Mostly speak English, teach one greeting or phrase at a time, say the German slowly, give the English meaning right away, and add a quick pronunciation cue when helpful. After the learner responds, react briefly, adapt, and either move to the next tiny step or ask them to try again. Keep every turn to one or two natural sentences with gentle encouragement. Do not switch to any other language.",
      introMessage:
        "Hi, I'm Max. Today we'll practice a few simple German greetings, and I'll help you say each one clearly.",
      topics: ['greetings', 'farewells', 'time-of-day phrases', 'politeness'],
    },
  },

  {
    id: 'de-lesson-2',
    unitId: 'de-unit-1',
    title: 'Introductions',
    description: 'Say your name and meet new people in German',
    icon: '🙋',
    xpReward: 10,
    goals: [
      { description: 'Say your name in German', xpReward: 5 },
      { description: 'Ask for someone\'s name', xpReward: 5 },
    ],
    vocabulary: [
      { word: 'Ich heiße', translation: 'My name is', pronunciation: 'ikh HY-seh', emoji: '🙋' },
      { word: 'Ich bin', translation: 'I am', pronunciation: 'ikh BIN', emoji: '👤' },
      { word: 'Name', translation: 'Name', pronunciation: 'NAH-meh', emoji: '🏷️' },
      { word: 'Aus', translation: 'From', pronunciation: 'OWS', emoji: '📍' },
      { word: 'Freut mich', translation: 'Pleased to meet you', pronunciation: 'froyt mikh', emoji: '😊' },
    ],
    phrases: [
      { text: 'Wie heißen Sie?', translation: 'What is your name? (formal)', pronunciation: 'vee HY-sen zee' },
      { text: 'Ich heiße Thomas.', translation: 'My name is Thomas.', pronunciation: 'ikh HY-seh TOH-mas' },
      { text: 'Woher kommen Sie?', translation: 'Where are you from?', pronunciation: 'vo-HAYR KOM-en zee' },
      { text: 'Ich komme aus Deutschland.', translation: 'I come from Germany.', pronunciation: 'ikh KOM-eh ows DOYCH-lant' },
    ],
    activities: [
      {
        id: 'de-lesson-2-act-1',
        type: 'multiple-choice',
        question: 'How do you say "My name is" in German?',
        correctAnswer: 'Ich heiße',
        options: ['Ich bin', 'Ich heiße', 'Wie heißen', 'Freut mich'],
      },
      {
        id: 'de-lesson-2-act-2',
        type: 'multiple-choice',
        question: 'What does "Woher kommen Sie?" mean?',
        correctAnswer: 'Where are you from?',
        options: ['What is your name?', 'How are you?', 'Where are you from?', 'Nice to meet you.'],
      },
      {
        id: 'de-lesson-2-act-3',
        type: 'translate',
        question: 'Translate: "Pleased to meet you"',
        correctAnswer: 'Freut mich',
        hint: 'It\'s a short expression of pleasure.',
      },
    ],
    aiTeacherPrompt: {
      systemPrompt:
        "You're Max, a warm, energetic German teacher leading a live voice lesson on German introductions. Stay only inside this lesson's goal, vocabulary, phrases, and context. Mostly speak English, teach one short phrase at a time, say the German slowly, give the English meaning right away, and add a quick pronunciation cue when helpful. Briefly explain the difference between Ich heiße and Ich bin when you first introduce them. After the learner responds, react briefly, adapt, and either move to the next tiny step or ask them to try again. Keep every turn to one or two natural sentences with gentle encouragement. Do not switch to any other language.",
      introMessage:
        "Hi again, I'm Max. Today we'll practice simple German introductions, one short phrase at a time.",
      topics: ['introductions', 'saying your name', 'asking names', 'where you are from'],
    },
  },

  // ─── French (extended) ─────────────────────────────────────────────────────

  {
    id: 'fr-lesson-3',
    unitId: 'fr-unit-1',
    title: 'Numbers 1–10',
    description: 'Count from one to ten in French',
    icon: '🔢',
    xpReward: 10,
    goals: [
      { description: 'Learn numbers 1 to 10 in French', xpReward: 7 },
      { description: 'Complete all activities', xpReward: 3 },
    ],
    vocabulary: [
      { word: 'Un', translation: '1 — One', pronunciation: 'uh', emoji: '1️⃣' },
      { word: 'Deux', translation: '2 — Two', pronunciation: 'duh', emoji: '2️⃣' },
      { word: 'Trois', translation: '3 — Three', pronunciation: 'twah', emoji: '3️⃣' },
      { word: 'Quatre', translation: '4 — Four', pronunciation: 'katr', emoji: '4️⃣' },
      { word: 'Cinq', translation: '5 — Five', pronunciation: 'sank', emoji: '5️⃣' },
      { word: 'Six', translation: '6 — Six', pronunciation: 'sees', emoji: '6️⃣' },
      { word: 'Sept', translation: '7 — Seven', pronunciation: 'set', emoji: '7️⃣' },
      { word: 'Huit', translation: '8 — Eight', pronunciation: 'weet', emoji: '8️⃣' },
      { word: 'Neuf', translation: '9 — Nine', pronunciation: 'nuhf', emoji: '9️⃣' },
      { word: 'Dix', translation: '10 — Ten', pronunciation: 'dees', emoji: '🔟' },
    ],
    phrases: [
      { text: 'Combien ?', translation: 'How many?', pronunciation: 'kom-byaN' },
      { text: 'Il y en a cinq.', translation: 'There are five.', pronunciation: 'eel-ee-on-a-sank' },
    ],
    activities: [
      {
        id: 'fr-lesson-3-act-1',
        type: 'multiple-choice',
        question: 'What is "cinq" in English?',
        correctAnswer: 'Five',
        options: ['Three', 'Four', 'Five', 'Six'],
      },
      {
        id: 'fr-lesson-3-act-2',
        type: 'multiple-choice',
        question: 'How do you say "eight" in French?',
        correctAnswer: 'Huit',
        options: ['Sept', 'Neuf', 'Huit', 'Six'],
      },
      {
        id: 'fr-lesson-3-act-3',
        type: 'translate',
        question: 'Translate: "Ten"',
        correctAnswer: 'Dix',
        hint: 'Pronounced "dees".',
      },
    ],
    aiTeacherPrompt: {
      systemPrompt:
        "You're Claire, a warm, energetic French teacher leading a live voice lesson on French numbers one through ten. Stay only inside this lesson's counting goal, vocabulary, phrases, and context. Mostly speak English, teach one number or counting phrase at a time, say the French slowly, give the English meaning right away, and add a quick pronunciation cue when helpful. After the learner responds, react briefly, adapt, and either move to the next tiny step or ask them to try again. Keep every turn to one or two natural sentences with gentle encouragement. Do not switch to any other language.",
      introMessage:
        "Hi, I'm Claire. Today we'll count from one to ten in French, and we'll take it one number at a time.",
      topics: ['numbers 1-10', 'counting', 'how many'],
    },
  },

  {
    id: 'fr-lesson-4',
    unitId: 'fr-unit-1',
    title: 'Colors',
    description: 'Learn basic colors in French',
    icon: '🎨',
    xpReward: 10,
    goals: [
      { description: 'Learn 6 colors in French', xpReward: 6 },
      { description: 'Complete all activities', xpReward: 4 },
    ],
    vocabulary: [
      { word: 'Rouge', translation: 'Red', pronunciation: 'rooj', emoji: '🔴' },
      { word: 'Bleu', translation: 'Blue', pronunciation: 'bluh', emoji: '🔵' },
      { word: 'Vert', translation: 'Green', pronunciation: 'vair', emoji: '🟢' },
      { word: 'Jaune', translation: 'Yellow', pronunciation: 'jhohn', emoji: '🟡' },
      { word: 'Noir', translation: 'Black', pronunciation: 'nwahr', emoji: '⚫' },
      { word: 'Blanc', translation: 'White', pronunciation: 'blahn', emoji: '⚪' },
    ],
    phrases: [
      { text: 'De quelle couleur est-ce ?', translation: 'What color is this?', pronunciation: 'duh kel koo-leur es' },
      { text: "C'est rouge.", translation: 'It is red.', pronunciation: 'say rooj' },
    ],
    activities: [
      {
        id: 'fr-lesson-4-act-1',
        type: 'multiple-choice',
        question: 'What does "bleu" mean?',
        correctAnswer: 'Blue',
        options: ['Red', 'Blue', 'Green', 'Yellow'],
      },
      {
        id: 'fr-lesson-4-act-2',
        type: 'multiple-choice',
        question: 'How do you say "green" in French?',
        correctAnswer: 'Vert',
        options: ['Rouge', 'Bleu', 'Vert', 'Jaune'],
      },
      {
        id: 'fr-lesson-4-act-3',
        type: 'translate',
        question: 'Translate: "Black"',
        correctAnswer: 'Noir',
        hint: 'Think of "film noir".',
      },
    ],
    aiTeacherPrompt: {
      systemPrompt:
        "You're Claire, a warm, energetic French teacher leading a live voice lesson on French colors. Stay only inside this lesson's goal, vocabulary, phrases, and context. Mostly speak English, teach one color or color phrase at a time, say the French slowly, give the English meaning right away, and add a quick pronunciation cue when helpful. After the learner responds, react briefly, adapt, and either move to the next tiny step or ask them to try again. Keep every turn to one or two natural sentences with gentle encouragement. Do not switch to any other language.",
      introMessage:
        "Hi, I'm Claire. Today we'll practice French colors, and I'll help you hear and say each one clearly.",
      topics: ['colors', 'adjectives', 'descriptions'],
    },
  },

  {
    id: 'fr-lesson-5',
    unitId: 'fr-unit-1',
    title: 'At the Café',
    description: 'Order food and drinks at a French café',
    icon: '☕',
    xpReward: 15,
    goals: [
      { description: 'Learn café vocabulary in French', xpReward: 8 },
      { description: 'Practice ordering in French', xpReward: 7 },
    ],
    vocabulary: [
      { word: 'Un café', translation: 'A coffee', pronunciation: 'uh kah-fay', emoji: '☕' },
      { word: 'Un thé', translation: 'A tea', pronunciation: 'uh tay', emoji: '🍵' },
      { word: "L'eau", translation: 'Water', pronunciation: 'loh', emoji: '💧' },
      { word: 'Un croissant', translation: 'A croissant', pronunciation: 'uh kwah-sahn', emoji: '🥐' },
      { word: "L'addition", translation: 'The bill', pronunciation: 'lah-dee-syohn', emoji: '🧾' },
    ],
    phrases: [
      { text: "Je voudrais un café, s'il vous plaît.", translation: 'I would like a coffee, please.', pronunciation: 'zhuh voo-dray uh kah-fay, seel voo play' },
      { text: "L'addition, s'il vous plaît.", translation: 'The bill, please.', pronunciation: 'lah-dee-syohn, seel voo play' },
    ],
    activities: [
      {
        id: 'fr-lesson-5-act-1',
        type: 'multiple-choice',
        question: 'How do you say "a coffee" in French?',
        correctAnswer: 'Un café',
        options: ['Un thé', 'Un café', "L'eau", 'Un croissant'],
      },
      {
        id: 'fr-lesson-5-act-2',
        type: 'translate',
        question: 'Translate: "The bill, please."',
        correctAnswer: "L'addition, s'il vous plaît.",
        hint: "L'addition means the bill.",
      },
      {
        id: 'fr-lesson-5-act-3',
        type: 'multiple-choice',
        question: 'What does "Je voudrais" mean?',
        correctAnswer: 'I would like',
        options: ['I want', 'I would like', 'Give me', 'Please'],
      },
    ],
    aiTeacherPrompt: {
      systemPrompt:
        "You're Claire, a warm, energetic French teacher leading a live voice lesson set in a French café. Stay only inside this lesson's café goal, vocabulary, phrases, and context. Mostly speak English, teach one food, drink, or ordering phrase at a time, say the French slowly, give the English meaning right away, and add a quick pronunciation cue when helpful. After the learner responds, react briefly, adapt, and either move to the next tiny step or ask them to try again. Keep every turn to one or two natural sentences with gentle encouragement. Do not switch to any other language.",
      introMessage:
        "Hi, I'm Claire. Today we'll practice a few French café words and ordering phrases you can use right away.",
      topics: ['food', 'drinks', 'ordering', 'café phrases'],
    },
  },

  // ─── Japanese (extended) ───────────────────────────────────────────────────

  {
    id: 'ja-lesson-3',
    unitId: 'ja-unit-1',
    title: '数字 — Numbers 1–10',
    description: 'Learn to count from one to ten in Japanese',
    icon: '🔢',
    xpReward: 10,
    goals: [
      { description: 'Learn numbers 1 to 10 in Japanese', xpReward: 7 },
      { description: 'Complete all activities', xpReward: 3 },
    ],
    vocabulary: [
      { word: 'いち', translation: '1 — One', pronunciation: 'i-chi', emoji: '1️⃣' },
      { word: 'に', translation: '2 — Two', pronunciation: 'ni', emoji: '2️⃣' },
      { word: 'さん', translation: '3 — Three', pronunciation: 'san', emoji: '3️⃣' },
      { word: 'し／よん', translation: '4 — Four', pronunciation: 'shi / yon', emoji: '4️⃣' },
      { word: 'ご', translation: '5 — Five', pronunciation: 'go', emoji: '5️⃣' },
      { word: 'ろく', translation: '6 — Six', pronunciation: 'ro-ku', emoji: '6️⃣' },
      { word: 'しち／なな', translation: '7 — Seven', pronunciation: 'shi-chi / na-na', emoji: '7️⃣' },
      { word: 'はち', translation: '8 — Eight', pronunciation: 'ha-chi', emoji: '8️⃣' },
      { word: 'きゅう／く', translation: '9 — Nine', pronunciation: 'kyu / ku', emoji: '9️⃣' },
      { word: 'じゅう', translation: '10 — Ten', pronunciation: 'ju', emoji: '🔟' },
    ],
    phrases: [
      { text: 'いくつですか？', translation: 'How many?', pronunciation: 'i-ku-tsu des-ka' },
      { text: 'ごつあります。', translation: 'There are five.', pronunciation: 'go-tsu a-ri-mas' },
    ],
    activities: [
      {
        id: 'ja-lesson-3-act-1',
        type: 'multiple-choice',
        question: 'What does "さん" mean?',
        correctAnswer: '3 — Three',
        options: ['1 — One', '2 — Two', '3 — Three', '4 — Four'],
      },
      {
        id: 'ja-lesson-3-act-2',
        type: 'multiple-choice',
        question: 'How do you say "five" in Japanese?',
        correctAnswer: 'ご',
        options: ['さん', 'ご', 'しち／なな', 'はち'],
      },
      {
        id: 'ja-lesson-3-act-3',
        type: 'translate',
        question: 'Translate: "Ten"',
        correctAnswer: 'じゅう',
        hint: 'Pronounced "ju".',
      },
    ],
    aiTeacherPrompt: {
      systemPrompt:
        "You're Yuki, a warm, energetic Japanese teacher leading a live voice lesson on Japanese numbers one through ten. Stay only inside this lesson's counting goal, vocabulary, phrases, and context. Mostly speak English, teach one number at a time, say the Japanese slowly, give the English meaning right away, and add a simple pronunciation cue when helpful. Mention the alternate readings for 4 and 7 in one short sentence when you reach them. After the learner responds, react briefly, adapt, and either move to the next tiny step or ask them to try again. Keep every turn to one or two natural sentences with gentle encouragement. Do not switch to any other language.",
      introMessage:
        "Hi, I'm Yuki. Today we'll count from one to ten in Japanese, and I'll make the tricky sounds feel manageable.",
      topics: ['numbers 1-10', 'counting', 'alternate readings'],
    },
  },

  {
    id: 'ja-lesson-4',
    unitId: 'ja-unit-1',
    title: 'Daily Verbs',
    description: 'Learn essential everyday action words in Japanese',
    icon: '🏃',
    xpReward: 10,
    goals: [
      { description: 'Learn 5 essential Japanese verbs', xpReward: 6 },
      { description: 'Complete all activities', xpReward: 4 },
    ],
    vocabulary: [
      { word: 'たべます', translation: 'To eat', pronunciation: 'ta-be-mas', emoji: '🍽️' },
      { word: 'のみます', translation: 'To drink', pronunciation: 'no-mi-mas', emoji: '🥤' },
      { word: 'いきます', translation: 'To go', pronunciation: 'i-ki-mas', emoji: '🚶' },
      { word: 'みます', translation: 'To see / watch', pronunciation: 'mi-mas', emoji: '👀' },
      { word: 'かいます', translation: 'To buy', pronunciation: 'ka-i-mas', emoji: '🛍️' },
    ],
    phrases: [
      { text: 'ごはんをたべます。', translation: 'I eat rice/a meal.', pronunciation: 'go-han-wo ta-be-mas' },
      { text: 'みずをのみます。', translation: 'I drink water.', pronunciation: 'mi-zu-wo no-mi-mas' },
    ],
    activities: [
      {
        id: 'ja-lesson-4-act-1',
        type: 'multiple-choice',
        question: 'What does "たべます" mean?',
        correctAnswer: 'To eat',
        options: ['To drink', 'To eat', 'To go', 'To buy'],
      },
      {
        id: 'ja-lesson-4-act-2',
        type: 'multiple-choice',
        question: 'How do you say "to drink" in Japanese?',
        correctAnswer: 'のみます',
        options: ['たべます', 'のみます', 'いきます', 'みます'],
      },
      {
        id: 'ja-lesson-4-act-3',
        type: 'translate',
        question: 'Translate: "To go"',
        correctAnswer: 'いきます',
        hint: 'Pronounced "i-ki-mas".',
      },
    ],
    aiTeacherPrompt: {
      systemPrompt:
        "You're Yuki, a warm, energetic Japanese teacher leading a live voice lesson on everyday Japanese verbs in the polite masu form. Stay only inside this lesson's goal, vocabulary, phrases, and context. Mostly speak English, teach one verb or example sentence at a time, say the Japanese slowly, give the English meaning right away, and add a simple pronunciation cue when helpful. After the learner responds, react briefly, adapt, and either move to the next tiny step or ask them to try again. Keep every turn to one or two natural sentences with gentle encouragement. Do not switch to any other language.",
      introMessage:
        "Hi, I'm Yuki. Today we'll practice a few everyday Japanese verbs, and I'll show you how the polite form works.",
      topics: ['verbs', 'masu form', 'daily actions', 'polite Japanese'],
    },
  },

  {
    id: 'ja-lesson-5',
    unitId: 'ja-unit-1',
    title: 'Food & Drinks',
    description: 'Learn vocabulary for food and drinks in Japanese',
    icon: '🍣',
    xpReward: 15,
    goals: [
      { description: 'Learn 5 food and drink words', xpReward: 8 },
      { description: 'Practice ordering food', xpReward: 7 },
    ],
    vocabulary: [
      { word: 'すし', translation: 'Sushi', pronunciation: 'su-shi', emoji: '🍣' },
      { word: 'ラーメン', translation: 'Ramen', pronunciation: 'ra-men', emoji: '🍜' },
      { word: 'みず', translation: 'Water', pronunciation: 'mi-zu', emoji: '💧' },
      { word: 'おちゃ', translation: 'Green tea', pronunciation: 'o-cha', emoji: '🍵' },
      { word: 'ごはん', translation: 'Rice / Meal', pronunciation: 'go-han', emoji: '🍚' },
    ],
    phrases: [
      { text: 'これをください。', translation: 'This one, please.', pronunciation: 'ko-re-wo ku-da-sai' },
      { text: 'おいしいです！', translation: 'It is delicious!', pronunciation: 'o-i-shi-i des' },
    ],
    activities: [
      {
        id: 'ja-lesson-5-act-1',
        type: 'multiple-choice',
        question: 'What does "おちゃ" mean?',
        correctAnswer: 'Green tea',
        options: ['Water', 'Green tea', 'Sushi', 'Ramen'],
      },
      {
        id: 'ja-lesson-5-act-2',
        type: 'translate',
        question: 'Translate: "This one, please."',
        correctAnswer: 'これをください。',
        hint: 'これ means "this".',
      },
      {
        id: 'ja-lesson-5-act-3',
        type: 'multiple-choice',
        question: 'How do you say "It is delicious" in Japanese?',
        correctAnswer: 'おいしいです！',
        options: ['ありがとうございます', 'おいしいです！', 'これをください', 'どうぞ'],
      },
    ],
    aiTeacherPrompt: {
      systemPrompt:
        "You're Yuki, a warm, energetic Japanese teacher leading a live voice lesson on Japanese food and drinks. Stay only inside this lesson's food goal, vocabulary, phrases, and context. Mostly speak English, teach one food, drink, or ordering phrase at a time, say the Japanese slowly, give the English meaning right away, and add a simple pronunciation cue when helpful. After the learner responds, react briefly, adapt, and either move to the next tiny step or ask them to try again. Keep every turn to one or two natural sentences with gentle encouragement. Do not switch to any other language.",
      introMessage:
        "Hi, I'm Yuki. Today we'll practice a few Japanese food and drink words, plus one simple phrase for ordering.",
      topics: ['food', 'drinks', 'ordering', 'Japanese cuisine'],
    },
  },

  // ─── German (extended) ─────────────────────────────────────────────────────

  {
    id: 'de-lesson-3',
    unitId: 'de-unit-1',
    title: 'Numbers 1–10',
    description: 'Count from one to ten in German',
    icon: '🔢',
    xpReward: 10,
    goals: [
      { description: 'Learn numbers 1 to 10 in German', xpReward: 7 },
      { description: 'Complete all activities', xpReward: 3 },
    ],
    vocabulary: [
      { word: 'Eins', translation: '1 — One', pronunciation: 'AYNS', emoji: '1️⃣' },
      { word: 'Zwei', translation: '2 — Two', pronunciation: 'TSVAI', emoji: '2️⃣' },
      { word: 'Drei', translation: '3 — Three', pronunciation: 'DRAI', emoji: '3️⃣' },
      { word: 'Vier', translation: '4 — Four', pronunciation: 'FEER', emoji: '4️⃣' },
      { word: 'Fünf', translation: '5 — Five', pronunciation: 'FUENF', emoji: '5️⃣' },
      { word: 'Sechs', translation: '6 — Six', pronunciation: 'ZEKS', emoji: '6️⃣' },
      { word: 'Sieben', translation: '7 — Seven', pronunciation: 'ZEE-ben', emoji: '7️⃣' },
      { word: 'Acht', translation: '8 — Eight', pronunciation: 'AKHT', emoji: '8️⃣' },
      { word: 'Neun', translation: '9 — Nine', pronunciation: 'NOYN', emoji: '9️⃣' },
      { word: 'Zehn', translation: '10 — Ten', pronunciation: 'TSAYN', emoji: '🔟' },
    ],
    phrases: [
      { text: 'Wie viele?', translation: 'How many?', pronunciation: 'vee FEE-leh' },
      { text: 'Es sind fünf.', translation: 'There are five.', pronunciation: 'es ZINT FUENF' },
    ],
    activities: [
      {
        id: 'de-lesson-3-act-1',
        type: 'multiple-choice',
        question: 'What is "fünf" in English?',
        correctAnswer: 'Five',
        options: ['Three', 'Four', 'Five', 'Six'],
      },
      {
        id: 'de-lesson-3-act-2',
        type: 'multiple-choice',
        question: 'How do you say "eight" in German?',
        correctAnswer: 'Acht',
        options: ['Sieben', 'Neun', 'Acht', 'Sechs'],
      },
      {
        id: 'de-lesson-3-act-3',
        type: 'translate',
        question: 'Translate: "Ten"',
        correctAnswer: 'Zehn',
        hint: 'Pronounced "TSAYN".',
      },
    ],
    aiTeacherPrompt: {
      systemPrompt:
        "You're Max, a warm, energetic German teacher leading a live voice lesson on German numbers one through ten. Stay only inside this lesson's counting goal, vocabulary, phrases, and context. Mostly speak English, teach one number or counting phrase at a time, say the German slowly, give the English meaning right away, and add a quick pronunciation cue when helpful. After the learner responds, react briefly, adapt, and either move to the next tiny step or ask them to try again. Keep every turn to one or two natural sentences with gentle encouragement. Do not switch to any other language.",
      introMessage:
        "Hi, I'm Max. Today we'll count from one to ten in German, and I'll help you with the new sounds.",
      topics: ['numbers 1-10', 'counting', 'German pronunciation'],
    },
  },

  {
    id: 'de-lesson-4',
    unitId: 'de-unit-1',
    title: 'Colors',
    description: 'Learn basic colors in German',
    icon: '🎨',
    xpReward: 10,
    goals: [
      { description: 'Learn 6 colors in German', xpReward: 6 },
      { description: 'Complete all activities', xpReward: 4 },
    ],
    vocabulary: [
      { word: 'Rot', translation: 'Red', pronunciation: 'ROHT', emoji: '🔴' },
      { word: 'Blau', translation: 'Blue', pronunciation: 'BLOW', emoji: '🔵' },
      { word: 'Grün', translation: 'Green', pronunciation: 'GRUEN', emoji: '🟢' },
      { word: 'Gelb', translation: 'Yellow', pronunciation: 'GELP', emoji: '🟡' },
      { word: 'Schwarz', translation: 'Black', pronunciation: 'SHVARTS', emoji: '⚫' },
      { word: 'Weiß', translation: 'White', pronunciation: 'VAIS', emoji: '⚪' },
    ],
    phrases: [
      { text: 'Welche Farbe ist das?', translation: 'What color is this?', pronunciation: 'VEL-kheh FAR-beh ist das' },
      { text: 'Das ist rot.', translation: 'This is red.', pronunciation: 'das ist ROHT' },
    ],
    activities: [
      {
        id: 'de-lesson-4-act-1',
        type: 'multiple-choice',
        question: 'What does "blau" mean?',
        correctAnswer: 'Blue',
        options: ['Red', 'Blue', 'Green', 'Yellow'],
      },
      {
        id: 'de-lesson-4-act-2',
        type: 'multiple-choice',
        question: 'How do you say "green" in German?',
        correctAnswer: 'Grün',
        options: ['Rot', 'Blau', 'Grün', 'Gelb'],
      },
      {
        id: 'de-lesson-4-act-3',
        type: 'translate',
        question: 'Translate: "Black"',
        correctAnswer: 'Schwarz',
        hint: 'Think of "Schwarzwald" — the Black Forest.',
      },
    ],
    aiTeacherPrompt: {
      systemPrompt:
        "You're Max, a warm, energetic German teacher leading a live voice lesson on German colors. Stay only inside this lesson's goal, vocabulary, phrases, and context. Mostly speak English, teach one color or color phrase at a time, say the German slowly, give the English meaning right away, and add a quick pronunciation cue when helpful. After the learner responds, react briefly, adapt, and either move to the next tiny step or ask them to try again. Keep every turn to one or two natural sentences with gentle encouragement. Do not switch to any other language.",
      introMessage:
        "Hi, I'm Max. Today we'll practice German colors, and I'll help you hear and say each one clearly.",
      topics: ['colors', 'adjectives', 'descriptions', 'German sounds'],
    },
  },

  {
    id: 'de-lesson-5',
    unitId: 'de-unit-1',
    title: 'Im Café',
    description: 'Order coffee and food at a German café',
    icon: '☕',
    xpReward: 15,
    goals: [
      { description: 'Learn café vocabulary in German', xpReward: 8 },
      { description: 'Practice ordering in German', xpReward: 7 },
    ],
    vocabulary: [
      { word: 'Einen Kaffee', translation: 'A coffee', pronunciation: 'AI-nen KAH-fay', emoji: '☕' },
      { word: 'Einen Tee', translation: 'A tea', pronunciation: 'AI-nen TAY', emoji: '🍵' },
      { word: 'Wasser', translation: 'Water', pronunciation: 'VAH-ser', emoji: '💧' },
      { word: 'Ein Croissant', translation: 'A croissant', pronunciation: 'ain kwah-SAHN', emoji: '🥐' },
      { word: 'Die Rechnung', translation: 'The bill', pronunciation: 'dee REKH-noong', emoji: '🧾' },
    ],
    phrases: [
      { text: 'Ich hätte gern einen Kaffee, bitte.', translation: 'I would like a coffee, please.', pronunciation: 'ikh HET-eh gern AI-nen KAH-fay, BIT-eh' },
      { text: 'Die Rechnung, bitte.', translation: 'The bill, please.', pronunciation: 'dee REKH-noong BIT-eh' },
    ],
    activities: [
      {
        id: 'de-lesson-5-act-1',
        type: 'multiple-choice',
        question: 'How do you say "a coffee" in German?',
        correctAnswer: 'Einen Kaffee',
        options: ['Einen Tee', 'Einen Kaffee', 'Wasser', 'Ein Croissant'],
      },
      {
        id: 'de-lesson-5-act-2',
        type: 'translate',
        question: 'Translate: "The bill, please."',
        correctAnswer: 'Die Rechnung, bitte.',
        hint: '"Die Rechnung" means the bill.',
      },
      {
        id: 'de-lesson-5-act-3',
        type: 'multiple-choice',
        question: 'What does "Ich hätte gern" mean?',
        correctAnswer: 'I would like',
        options: ['I want', 'I would like', 'Give me', 'Please'],
      },
    ],
    aiTeacherPrompt: {
      systemPrompt:
        "You're Max, a warm, energetic German teacher leading a live voice lesson set in a German café. Stay only inside this lesson's café goal, vocabulary, phrases, and context. Mostly speak English, teach one food, drink, or ordering phrase at a time, say the German slowly, give the English meaning right away, and add a quick pronunciation cue when helpful. After the learner responds, react briefly, adapt, and either move to the next tiny step or ask them to try again. Keep every turn to one or two natural sentences with gentle encouragement. Do not switch to any other language.",
      introMessage:
        "Hi, I'm Max. Today we'll practice a few German café words and ordering phrases you can use right away.",
      topics: ['food', 'drinks', 'ordering', 'café phrases', 'polite German'],
    },
  },
];
