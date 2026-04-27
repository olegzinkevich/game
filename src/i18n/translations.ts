// Supported languages
export type Language = 'en' | 'ru' | 'es' | 'tr' | 'kk' | 'uz';

export const DEFAULT_LANGUAGE: Language = 'en';

// Translation keys interface for type safety
export interface TranslationStrings {
  // Menu
  gameTitle: string;
  gameDescription: string;
  resumeGame: string;
  startGame: string;
  continueGame: string;
  level: string;
  surviveFor: string;
  orbits: string;
  shields: string;
  controlsHint: string;

  // Game Overlay
  levelComplete: string;
  collision: string;
  congratulations: string;
  levelFailed: string;
  retryLevel: string;
  nextLevel: string;
  backToMenu: string;
  levelCompleted: string;
  gameCompleted: string;
  gameCompletedMessage: string;

  // HUD
  paused: string;
  continue: string;
  menu: string;
  clickOrbitsHint: string;

  // Loading
  loading: string;

  // Planets Panel
  planetControl: string;
  gameOvers: string;
  unlockedDestroyers: string;
  planet: string;
  removePlanet: string;
  unlockedAfter: string;
  dragSlidersHint: string;

  // Speed labels
  speedVerySlow: string;
  speedSlow: string;
  speedNormal: string;
  speedFast: string;
  speedSuperFast: string;
  speedTooltip: string;
}

export const translations: Record<Language, TranslationStrings> = {
  en: {
    // Menu
    gameTitle: 'Orbital Chaos',
    gameDescription: 'Find the optimal orbital motion of the planets. Use the speed sliders to change the speed of the planets and avoid collisions. Some planets may have a protected orbit (shield). It is impossible to control the speed of such planets. If you have lost the game 5 times, one of the planets will have a button to destroy the planet. This will simplify the game. With every 5th loss, you can destroy another planet.',
    resumeGame: 'Resume Game',
    startGame: 'Start Game',
    continueGame: 'Continue Game',
    level: 'Level',
    surviveFor: 'Survive for {{seconds}} seconds',
    orbits: 'orbits',
    shields: 'shields',
    controlsHint: 'Controls: Use slider to change speed \u2022 Press P to pause',

    // Game Overlay
    levelComplete: 'Level Complete!',
    collision: 'Collision!',
    congratulations: 'Congratulations! You survived Level {{id}}: {{name}}',
    levelFailed: 'Level {{id}} failed. Try again!',
    retryLevel: 'Retry Level',
    nextLevel: 'Next Level',
    backToMenu: 'Back to Menu',
    levelCompleted: 'Level {{id}} completed!',
    gameCompleted: 'Congratulations! You beat the game!',
    gameCompletedMessage: 'We are working on new levels, stay tuned for updates!',

    // HUD
    paused: 'PAUSED',
    continue: 'Continue',
    menu: 'Menu',
    clickOrbitsHint: 'Use slider to control speed',

    // Loading
    loading: 'Loading...',

    // Planets Panel
    planetControl: 'Planet Control',
    gameOvers: 'Game Overs',
    unlockedDestroyers: 'Unlocked destroyers!',
    planet: 'Planet',
    removePlanet: 'Remove Planet {{index}}',
    unlockedAfter: 'Unlocked after {{count}} game overs',
    dragSlidersHint: 'Drag sliders to adjust planet speeds',

    // Speed labels
    speedVerySlow: 'Very Slow',
    speedSlow: 'Slow',
    speedNormal: 'Normal',
    speedFast: 'Fast',
    speedSuperFast: 'Super Fast',
    speedTooltip: 'Speed: {{speed}}x',
  },

  ru: {
    // Menu
    gameTitle: 'Orbital Chaos',
    gameDescription: 'Найдите оптимальное орбитальное движение планет. Используйте слайдеры скорости, чтобы изменить скорость планет и избежать столкновений. Некоторые планеты могут иметь защищенную орбиту (щит). Управлять скоростью таких планет нельзя. Если вы проиграли игру 5 раз, у одной из планет появится кнопка - уничтожить планету. Это упростит игру. С каждым 5-м проигрышем, можно уничтожить еще одну планету.',
    resumeGame: 'Продолжить игру',
    startGame: 'Начать игру',
    continueGame: 'Продолжить игру',
    level: 'Уровень',
    surviveFor: 'Продержитесь {{seconds}} секунд',
    orbits: 'орбит',
    shields: 'щитов',
    controlsHint: 'Управление: Используйте слайдер для изменения скорости \u2022 P - пауза',

    // Game Overlay
    levelComplete: 'Уровень пройден!',
    collision: 'Столкновение!',
    congratulations: 'Поздравляем! Вы прошли Уровень {{id}}: {{name}}',
    levelFailed: 'Уровень {{id}} провален. Попробуйте снова!',
    retryLevel: 'Повторить',
    nextLevel: 'Следующий уровень',
    backToMenu: 'В меню',
    levelCompleted: 'Уровень {{id}} пройден!',
    gameCompleted: 'Поздравляем! Вы прошли игру!',
    gameCompletedMessage: 'Мы работаем над новыми уровнями, следите за обновлениями!',

    // HUD
    paused: 'ПАУЗА',
    continue: 'Продолжить',
    menu: 'Меню',
    clickOrbitsHint: 'Ипользуйте слайдер для управления скоростью',

    // Loading
    loading: 'Загрузка...',

    // Planets Panel
    planetControl: 'Управление планетами',
    gameOvers: 'Поражений',
    unlockedDestroyers: 'Разблокированы уничтожители планет!',
    planet: 'Планета',
    removePlanet: 'Уничтожить Планету {{index}}',
    unlockedAfter: 'Разблокировано после {{count}} поражений',
    dragSlidersHint: 'Используйте слайдер для настройки скорости',

    // Speed labels
    speedVerySlow: 'Очень медленно',
    speedSlow: 'Медленно',
    speedNormal: 'Нормально',
    speedFast: 'Быстро',
    speedSuperFast: 'Очень быстро',
    speedTooltip: 'Скорость: {{speed}}x',
  },

  es: {
    // Menu
    gameTitle: 'Orbital Chaos',
    gameDescription: 'Encuentra el movimiento orbital optimo de los planetas. Use los controles deslizantes de velocidad para cambiar la velocidad de los planetas y evitar colisiones. Algunos planetas pueden tener una orbita protegida (escudo). No se puede controlar la velocidad de estos planetas. Si pierdes el juego 5 veces, uno de los planetas tendra un boton - destruir el planeta. Esto simplificara el juego. Con cada quinta perdida, se puede destruir otro planeta.',
    resumeGame: 'Continuar juego',
    startGame: 'Iniciar juego',
    continueGame: 'Continuar juego',
    level: 'Nivel',
    surviveFor: 'Sobrevive {{seconds}} segundos',
    orbits: 'orbitas',
    shields: 'escudos',
    controlsHint: 'Controles: utiliza sliders para cambiar velocidad \u2022 P para pausar',

    // Game Overlay
    levelComplete: 'Nivel completado!',
    collision: 'Colision!',
    congratulations: 'Felicidades! Sobreviviste el Nivel {{id}}: {{name}}',
    levelFailed: 'Nivel {{id}} fallido. Intentalo de nuevo!',
    retryLevel: 'Reintentar',
    nextLevel: 'Siguiente nivel',
    backToMenu: 'Volver al menu',
    levelCompleted: 'Nivel {{id}} completado!',
    gameCompleted: 'Felicidades! Has completado el juego!',
    gameCompletedMessage: 'Estamos trabajando en nuevos niveles, estate atento a las actualizaciones!',

    // HUD
    paused: 'PAUSA',
    continue: 'Continuar',
    menu: 'Menú',
    clickOrbitsHint: 'Utiliza sliders para para controlar velocidad',

    // Loading
    loading: 'Cargando...',

    // Planets Panel
    planetControl: 'Control de Planetas',
    gameOvers: 'Derrotas',
    unlockedDestroyers: 'Destructores desbloqueados!',
    planet: 'Planeta',
    removePlanet: 'Destruir Planeta {{index}}',
    unlockedAfter: 'Desbloqueado tras {{count}} derrotas',
    dragSlidersHint: 'Utiliza sliders para ajustar la velocidad',

    // Speed labels
    speedVerySlow: 'Muy lento',
    speedSlow: 'Lento',
    speedNormal: 'Normal',
    speedFast: 'Rapido',
    speedSuperFast: 'Muy rapido',
    speedTooltip: 'Velocidad: {{speed}}x',
  },

  tr: {
    // Menu
    gameTitle: 'Orbital Chaos',
    gameDescription: 'Gezegenlerin \u00e7arpi\u015fmamasi i\u00e7in y\u00f6r\u00fcnge zamanlamasini kontrol edin. Hizlarini de\u011fi\u015ftirmek i\u00e7in y\u00f6r\u00fcngelere tiklayin.',
    resumeGame: 'Oyuna Devam Et',
    startGame: 'Oyunu Başlat',
    continueGame: 'Oyuna Devam Et',
    level: 'Seviye',
    surviveFor: '{{seconds}} saniye hayatta kal',
    orbits: 'y\u00f6r\u00fcnge',
    shields: 'kalkan',
    controlsHint: 'Kontroller: Hizi de\u011fi\u015ftirmek i\u00e7in y\u00f6r\u00fcngelere tiklayin \u2022 P - duraklat',

    // Game Overlay
    levelComplete: 'Seviye Tamamlandi!',
    collision: '\u00c7arpi\u015fma!',
    congratulations: 'Tebrikler! Seviye {{id}}: {{name}} tamamlandi',
    levelFailed: 'Seviye {{id}} ba\u015farisiz. Tekrar deneyin!',
    retryLevel: 'Tekrar Dene',
    nextLevel: 'Sonraki Seviye',
    backToMenu: 'Menüye Dön',
    levelCompleted: 'Seviye {{id}} tamamlandi!',
    gameCompleted: 'Tebrikler! Oyunu bitirdiniz!',
    gameCompletedMessage: 'Yeni seviyeler üzerinde çalışıyoruz, güncellemeleri takip edin!',

    // HUD
    paused: 'DURAKLATILDI',
    continue: 'Devam Et',
    menu: 'Menü',
    clickOrbitsHint: 'Hizi kontrol etmek için yörüngelere tiklayin',

    // Loading
    loading: 'Yükleniyor...',

    // Planets Panel
    planetControl: 'Gezegen Kontrol\u00fc',
    gameOvers: 'Oyun Bitti\u015fi',
    unlockedDestroyers: 'Yok ediciler a\u00e7ildi!',
    planet: 'Gezegen',
    removePlanet: 'Gezegen {{index}} Kaldir',
    unlockedAfter: '{{count}} oyun bitti\u015finden sonra a\u00e7ildi',
    dragSlidersHint: 'Hizi ayarlamak i\u00e7in kaydiricilari s\u00fcr\u00fckleyin',

    // Speed labels
    speedVerySlow: 'Çok Yavas',
    speedSlow: 'Yavas',
    speedNormal: 'Normal',
    speedFast: 'Hizli',
    speedSuperFast: 'Çok Hizli',
    speedTooltip: 'Hiz: {{speed}}x',
  },

  kk: {
    // Menu
    gameTitle: 'Orbital Chaos',
    gameDescription: 'Планеталардың оңтайлы орбиталық қозғалысын табыңыз. Планеталардың жылдамдығын өзгерту және соқтығысуларды болдырмау үшін жылдамдық слайдерлерін пайдаланыңыз. Кейбір планеталарда қорғалған орбита (қалқан) болуы мүмкін. Мұндай планеталардың жылдамдығын басқару мүмкін емес. Егер сіз 5 рет ұтылсаңыз, планеталардың біреуінде планетаны жою батырмасы пайда болады. Бұл ойынды жеңілдетеді.',
    resumeGame: 'Ойынды жалғастыру',
    startGame: 'Ойынды бастау',
    continueGame: 'Ойынды жалғастыру',
    level: 'Деңгей',
    surviveFor: '{{seconds}} секунд өмір сүру',
    orbits: 'орбита',
    shields: 'қалқан',
    controlsHint: 'Басқару: Жылдамдықты өзгерту үшін слайдерді пайдаланыңыз • P - кідірту',

    // Game Overlay
    levelComplete: 'Деңгей өтілді!',
    collision: 'Соқтығыс!',
    congratulations: 'Құттықтаймыз! Сіз {{id}} деңгейді өттіңіз: {{name}}',
    levelFailed: '{{id}} деңгей сәтсіз. Қайталап көріңіз!',
    retryLevel: 'Қайталау',
    nextLevel: 'Келесі деңгей',
    backToMenu: 'Мәзірге',
    levelCompleted: '{{id}} деңгей өтілді!',
    gameCompleted: 'Құттықтаймыз! Сіз ойынды өттіңіз!',
    gameCompletedMessage: 'Біз жаңа деңгейлер үстінде жұмыс істеп жатырмыз, жаңартуларды қадағалаңыз!',

    // HUD
    paused: 'КІДІРТІЛДІ',
    continue: 'Жалғастыру',
    menu: 'Мәзір',
    clickOrbitsHint: 'Жылдамдықты басқару үшін слайдерді пайдаланыңыз',

    // Loading
    loading: 'Жүктелуде...',

    // Planets Panel
    planetControl: 'Планеталарды басқару',
    gameOvers: 'Жеңілістер',
    unlockedDestroyers: 'Жойғыштар ашылды!',
    planet: 'Планета',
    removePlanet: '{{index}} планетаны жою',
    unlockedAfter: '{{count}} жеңілістен кейін ашылады',
    dragSlidersHint: 'Жылдамдықты реттеу үшін слайдерлерді пайдаланыңыз',

    // Speed labels
    speedVerySlow: 'Өте баяу',
    speedSlow: 'Баяу',
    speedNormal: 'Қалыпты',
    speedFast: 'Жылдам',
    speedSuperFast: 'Өте жылдам',
    speedTooltip: 'Жылдамдық: {{speed}}x',
  },

  uz: {
    // Menu
    gameTitle: 'Orbital Chaos',
    gameDescription: 'Sayyoralarning optimal orbital harakatini toping. Sayyoralar tezligini o\'zgartirish va to\'qnashuvlardan qochish uchun tezlik slayderlari yordaming. Ba\'zi sayyoralarda himoyalangan orbita (qalqon) bo\'lishi mumkin. Bunday sayyoralarning tezligini boshqarib bo\'lmaydi. Agar siz 5 marta yutqazsangiz, sayyoralardan birida sayyorani yo\'q qilish tugmasi paydo bo\'ladi.',
    resumeGame: 'O\'yinni davom ettirish',
    startGame: 'O\'yinni boshlash',
    continueGame: 'O\'yinni davom ettirish',
    level: 'Daraja',
    surviveFor: '{{seconds}} soniya omon qoling',
    orbits: 'orbita',
    shields: 'qalqon',
    controlsHint: 'Boshqaruv: Tezlikni o\'zgartirish uchun slayderni ishlating • P - pauza',

    // Game Overlay
    levelComplete: 'Daraja o\'tildi!',
    collision: 'To\'qnashuv!',
    congratulations: 'Tabriklaymiz! Siz {{id}} darajani o\'tdingiz: {{name}}',
    levelFailed: '{{id}} daraja muvaffaqiyatsiz. Qayta urinib ko\'ring!',
    retryLevel: 'Qayta urinish',
    nextLevel: 'Keyingi daraja',
    backToMenu: 'Menyuga',
    levelCompleted: '{{id}} daraja o\'tildi!',
    gameCompleted: 'Tabriklaymiz! Siz o\'yinni o\'tdingiz!',
    gameCompletedMessage: 'Biz yangi darajalar ustida ishlamoqdamiz, yangilanishlarni kuzatib boring!',

    // HUD
    paused: 'TO\'XTATILDI',
    continue: 'Davom etish',
    menu: 'Menyu',
    clickOrbitsHint: 'Tezlikni boshqarish uchun slayderni ishlating',

    // Loading
    loading: 'Yuklanmoqda...',

    // Planets Panel
    planetControl: 'Sayyoralarni boshqarish',
    gameOvers: 'Mag\'lubiyatlar',
    unlockedDestroyers: 'Yo\'q qiluvchilar ochildi!',
    planet: 'Sayyora',
    removePlanet: '{{index}} sayyorani yo\'q qilish',
    unlockedAfter: '{{count}} mag\'lubiyatdan keyin ochiladi',
    dragSlidersHint: 'Tezlikni sozlash uchun slayderlarni ishlating',

    // Speed labels
    speedVerySlow: 'Juda sekin',
    speedSlow: 'Sekin',
    speedNormal: 'Oddiy',
    speedFast: 'Tez',
    speedSuperFast: 'Juda tez',
    speedTooltip: 'Tezlik: {{speed}}x',
  },
};

// Helper function to interpolate variables in translation strings
export const interpolate = (str: string, params: Record<string, string | number>): string => {
  let result = str;
  for (const [key, value] of Object.entries(params)) {
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), String(value));
  }
  return result;
};

// Level translations
export interface LevelTranslation {
  name: string;
  description: string;
}

export const levelTranslations: Record<Language, Record<number, LevelTranslation>> = {
  en: {
    1: { name: 'First Contact', description: 'Learn the basics with crossing elliptical orbits' },
    2: { name: 'Close Encounters', description: 'Faster orbits with crossing elliptical paths' },
    3: { name: 'Orbital Dance', description: 'Complex timing with multiple elliptical crossings' },
    4: { name: 'Shield Protocol', description: 'Introducing shield orbits for emergency protection' },
    5: { name: 'Critical Mass', description: 'Maximum challenge with shields and complex elliptical orbits' },
    6: { name: 'Master Control', description: 'The ultimate orbital traffic challenge with elliptical orbits' },
    7: { name: 'Master Challenge', description: 'The ultimate test of orbital traffic mastery with 8 planets' },
    8: { name: 'Orbital Mastery', description: 'Advanced orbital control with strategic shield placement' },
    9: { name: 'Speed Demons', description: 'Fast-moving planets require constant attention' },
    10: { name: 'Eccentric Paths', description: 'Highly elliptical orbits create unpredictable crossings' },
    11: { name: 'Nested Chaos', description: 'Concentric orbits with different speeds' },
    12: { name: 'Cosmic Dance', description: 'Elegant figure-8 patterns with intersecting orbital flows' },
    14: { name: 'Shield Symphony', description: 'Multiple shields - use them wisely!' },
    15: { name: 'Asymmetric Assault', description: 'All planets clustered to one side' },
    16: { name: 'Time Pressure', description: 'Endurance test - survive for a full minute!' },
    17: { name: 'Velocity Variance', description: 'Mix of very slow and super fast orbits' },
    18: { name: 'Figure Eight', description: 'Fast-paced figure-eight patterns with dynamic crossings' },
    19: { name: 'Rush Hour', description: 'Controlled regional zones - master precise orbital timing' },
    20: { name: 'Orbital Harmony', description: 'Balanced 8-planet system - find the perfect orbital rhythm' },
    21: { name: 'Grand Orbits', description: 'Massive orbital paths - spacious 9-planet grand tour' },
    22: { name: 'Orbital Overload', description: '9 planets - maximum chaos management' },
    23: { name: 'Final Frontier', description: 'Massive planetary giants in spiral formation with strategic shields' },
  },
  ru: {
    1: { name: 'Первый контакт', description: 'Изучите основы игры с пересекающимися эллиптическими орбитами' },
    2: { name: 'Близкие встречи', description: 'Быстрые орбиты с пересекающимися траекториями' },
    3: { name: 'Орбитальный танец', description: 'Сложный тайминг с множественными пересечениями' },
    4: { name: 'Протокол защиты', description: 'Знакомство с защитными орбитами для экстренной защиты' },
    5: { name: 'Критическая масса', description: 'Максимальный вызов со щитами и сложными орбитами' },
    6: { name: 'Мастер-контроль', description: 'Абсолютный вызов орбитального трафика' },
    7: { name: 'Испытание мастера', description: 'Финальный тест мастерства с 8 планетами' },
    8: { name: 'Орбитальное мастерство', description: 'Продвинутый контроль со стратегическим размещением щитов' },
    9: { name: 'Скоростные демоны', description: 'Быстро движущиеся планеты требуют постоянного внимания' },
    10: { name: 'Эксцентричные пути', description: 'Высокоэллиптические орбиты создают непредсказуемые пересечения' },
    11: { name: 'Вложенный хаос', description: 'Концентрические орбиты с разными скоростями' },
    12: { name: 'Космический танец', description: 'Элегантные узоры восьмёрки с пересекающимися потоками' },
    14: { name: 'Симфония щитов', description: 'Множество щитов - используйте их мудро!' },
    15: { name: 'Асимметричная атака', description: 'Все планеты сгруппированы с одной стороны' },
    16: { name: 'Давление времени', description: 'Тест на выносливость - продержитесь целую минуту!' },
    17: { name: 'Разброс скоростей', description: 'Смесь очень медленных и сверхбыстрых орбит' },
    18: { name: 'Восьмёрка', description: 'Быстрые узоры восьмёрки с динамичными пересечениями' },
    19: { name: 'Час пик', description: 'Контролируемые зоны - освойте точный тайминг' },
    20: { name: 'Орбитальная гармония', description: 'Сбалансированная система из 8 планет - найдите идеальный ритм' },
    21: { name: 'Грандиозные орбиты', description: 'Массивные орбитальные пути - просторный тур из 9 планет' },
    22: { name: 'Орбитальная перегрузка', description: '9 планет - максимальное управление хаосом' },
    23: { name: 'Последний рубеж', description: 'Массивные планетарные гиганты в спиральной формации со щитами' },
  },
  es: {
    1: { name: 'Primer Contacto', description: 'Aprende lo basico con orbitas elipticas cruzadas' },
    2: { name: 'Encuentros Cercanos', description: 'Orbitas rapidas con trayectorias cruzadas' },
    3: { name: 'Danza Orbital', description: 'Sincronizacion compleja con multiples cruces' },
    4: { name: 'Protocolo de Escudo', description: 'Introduccion a orbitas de escudo para proteccion' },
    5: { name: 'Masa Critica', description: 'Maximo desafio con escudos y orbitas complejas' },
    6: { name: 'Control Maestro', description: 'El desafio definitivo del trafico orbital' },
    7: { name: 'Desafio Maestro', description: 'La prueba final de maestria con 8 planetas' },
    8: { name: 'Maestria Orbital', description: 'Control avanzado con colocacion estrategica de escudos' },
    9: { name: 'Demonios de Velocidad', description: 'Planetas rapidos requieren atencion constante' },
    10: { name: 'Caminos Excentricos', description: 'Orbitas muy elipticas crean cruces impredecibles' },
    11: { name: 'Caos Anidado', description: 'Orbitas concentricas con diferentes velocidades' },
    12: { name: 'Danza Cosmica', description: 'Elegantes patrones en forma de 8 con flujos cruzados' },
    14: { name: 'Sinfonia de Escudos', description: 'Multiples escudos - usalos sabiamente!' },
    15: { name: 'Asalto Asimetrico', description: 'Todos los planetas agrupados a un lado' },
    16: { name: 'Presion de Tiempo', description: 'Prueba de resistencia - sobrevive un minuto!' },
    17: { name: 'Variacion de Velocidad', description: 'Mezcla de orbitas muy lentas y super rapidas' },
    18: { name: 'Figura Ocho', description: 'Patrones rapidos en forma de 8 con cruces dinamicos' },
    19: { name: 'Hora Punta', description: 'Zonas controladas - domina el timing preciso' },
    20: { name: 'Armonia Orbital', description: 'Sistema de 8 planetas - encuentra el ritmo perfecto' },
    21: { name: 'Grandes Orbitas', description: 'Trayectorias masivas - tour espacioso de 9 planetas' },
    22: { name: 'Sobrecarga Orbital', description: '9 planetas - gestion maxima del caos' },
    23: { name: 'Frontera Final', description: 'Gigantes planetarios en formacion espiral con escudos' },
  },
  tr: {
    1: { name: 'Ilk Temas', description: 'Kesisen eliptik yörüngelerle temelleri ögren' },
    2: { name: 'Yakin Karsilasma', description: 'Kesisen yollarla hizli yörüngeler' },
    3: { name: 'Yörünge Dansi', description: 'Coklu kesismelerle karmasik zamanlama' },
    4: { name: 'Kalkan Protokolü', description: 'Acil koruma icin kalkan yörüngelerini tanima' },
    5: { name: 'Kritik Kütle', description: 'Kalkanlar ve karmasik yörüngelerle maksimum zorluk' },
    6: { name: 'Usta Kontrol', description: 'Eliptik yörüngelerle nihai yörünge trafigi' },
    7: { name: 'Usta Meydan Okumasi', description: '8 gezegenle ustalık testi' },
    8: { name: 'Yörünge Ustalig', description: 'Stratejik kalkan yerlesimi ile gelismis kontrol' },
    9: { name: 'Hiz Seytanlari', description: 'Hizli gezegenler sürekli dikkat gerektirir' },
    10: { name: 'Eksantrik Yollar', description: 'Yüksek eliptik yörüngeler öngörülemeyen kesismeler yaratir' },
    11: { name: 'Ic Ice Kaos', description: 'Farkli hizlarda es merkezli yörüngeler' },
    12: { name: 'Kozmik Dans', description: 'Kesisen akislarla zarif sekiz desenleri' },
    14: { name: 'Kalkan Senfonisi', description: 'Birden fazla kalkan - akillica kullan!' },
    15: { name: 'Asimetrik Saldiri', description: 'Tüm gezegenler bir tarafa kümelenmis' },
    16: { name: 'Zaman Baskisi', description: 'Dayaniklilik testi - bir dakika hayatta kal!' },
    17: { name: 'Hiz Farkliligi', description: 'Cok yavas ve süper hizli yörüngelerin karisimi' },
    18: { name: 'Sekiz Figürü', description: 'Dinamik kesismelerle hizli sekiz desenleri' },
    19: { name: 'Yogun Saat', description: 'Kontrollü bölgeler - hassas zamanlamayi ustalasin' },
    20: { name: 'Yörünge Uyumu', description: '8 gezegenli sistem - mükemmel ritmi bul' },
    21: { name: 'Büyük Yörüngeler', description: 'Devasa yörünge yollari - 9 gezegenli tur' },
    22: { name: 'Yörünge Asirı Yükü', description: '9 gezegen - maksimum kaos yönetimi' },
    23: { name: 'Son Sinir', description: 'Kalkanlarla spiral formasyonda devasa gezegen devleri' },
  },
  kk: {
    1: { name: 'Бірінші байланыс', description: 'Қиылысатын эллиптикалық орбиталармен негіздерді үйреніңіз' },
    2: { name: 'Жақын кездесулер', description: 'Қиылысатын жолдармен жылдам орбиталар' },
    3: { name: 'Орбиталық би', description: 'Көптеген қиылысулармен күрделі уақыт' },
    4: { name: 'Қалқан хаттамасы', description: 'Шұғыл қорғау үшін қалқан орбиталарымен танысу' },
    5: { name: 'Сыни масса', description: 'Қалқандар мен күрделі орбиталармен максималды қиындық' },
    6: { name: 'Шебер бақылау', description: 'Эллиптикалық орбиталармен түпкілікті орбиталық трафик' },
    7: { name: 'Шебер сынақ', description: '8 планетамен шеберлік сынағы' },
    8: { name: 'Орбиталық шеберлік', description: 'Стратегиялық қалқан орналастырумен жетілдірілген бақылау' },
    9: { name: 'Жылдамдық демондары', description: 'Жылдам планеталар тұрақты назар аударуды қажет етеді' },
    10: { name: 'Эксцентрлік жолдар', description: 'Жоғары эллиптикалық орбиталар болжанбайтын қиылысулар жасайды' },
    11: { name: 'Кірістірілген хаос', description: 'Әртүрлі жылдамдықтағы концентрлік орбиталар' },
    12: { name: 'Ғарыштық би', description: 'Қиылысатын ағындармен талғампаз сегіздік өрнектер' },
    14: { name: 'Қалқан симфониясы', description: 'Көп қалқандар - оларды дұрыс пайдаланыңыз!' },
    15: { name: 'Асимметриялық шабуыл', description: 'Барлық планеталар бір жаққа топтасқан' },
    16: { name: 'Уақыт қысымы', description: 'Төзімділік сынағы - бір минут өмір сүріңіз!' },
    17: { name: 'Жылдамдық вариациясы', description: 'Өте баяу және өте жылдам орбиталардың қоспасы' },
    18: { name: 'Сегіздік фигура', description: 'Динамикалық қиылысулармен жылдам сегіздік өрнектер' },
    19: { name: 'Шарықтау сағаты', description: 'Бақыланатын аймақтар - дәл уақытты меңгеріңіз' },
    20: { name: 'Орбиталық үйлесім', description: '8 планеталық жүйе - тамаша ырғақты табыңыз' },
    21: { name: 'Үлкен орбиталар', description: 'Алып орбиталық жолдар - 9 планеталық кең тур' },
    22: { name: 'Орбиталық шамадан тыс жүктеме', description: '9 планета - максималды хаос басқару' },
    23: { name: 'Соңғы шекара', description: 'Қалқандармен спиральды формациядағы алып планеталық гиганттар' },
  },
  uz: {
    1: { name: 'Birinchi aloqa', description: 'Kesishuvchi elliptik orbitalar bilan asoslarni o\'rganing' },
    2: { name: 'Yaqin uchrashuvlar', description: 'Kesishuvchi yo\'llar bilan tez orbitalar' },
    3: { name: 'Orbital raqs', description: 'Ko\'p kesishuvlar bilan murakkab vaqt' },
    4: { name: 'Qalqon protokoli', description: 'Shoshilinch himoya uchun qalqon orbitalari bilan tanishish' },
    5: { name: 'Tanqidiy massa', description: 'Qalqonlar va murakkab orbitalar bilan maksimal qiyinchilik' },
    6: { name: 'Usta nazorat', description: 'Elliptik orbitalar bilan yakuniy orbital trafik' },
    7: { name: 'Usta sinov', description: '8 sayyora bilan mahorat sinovi' },
    8: { name: 'Orbital mahorat', description: 'Strategik qalqon joylashuvi bilan rivojlangan nazorat' },
    9: { name: 'Tezlik demonlari', description: 'Tez sayyoralar doimiy e\'tibor talab qiladi' },
    10: { name: 'Ekssentrik yo\'llar', description: 'Yuqori elliptik orbitalar oldindan aytib bo\'lmaydigan kesishuvlar yaratadi' },
    11: { name: 'Ichki xaos', description: 'Turli tezliklarda konsentrik orbitalar' },
    12: { name: 'Kosmik raqs', description: 'Kesishuvchi oqimlar bilan nafis sakkizlik naqshlar' },
    14: { name: 'Qalqon simfoniyasi', description: 'Ko\'p qalqonlar - ularni to\'g\'ri ishlating!' },
    15: { name: 'Asimmetrik hujum', description: 'Barcha sayyoralar bir tomonga to\'plangan' },
    16: { name: 'Vaqt bosimi', description: 'Chidamlilik sinovi - bir daqiqa omon qoling!' },
    17: { name: 'Tezlik variatsiyasi', description: 'Juda sekin va juda tez orbitalar aralashmasi' },
    18: { name: 'Sakkizlik figura', description: 'Dinamik kesishuvlar bilan tez sakkizlik naqshlar' },
    19: { name: 'Tirbandlik soati', description: 'Nazorat qilinadigan hududlar - aniq vaqtni o\'zlashtiring' },
    20: { name: 'Orbital uyg\'unlik', description: '8 sayyorali tizim - mukammal ritmni toping' },
    21: { name: 'Ulkan orbitalar', description: 'Ulkan orbital yo\'llar - 9 sayyorali keng sayohat' },
    22: { name: 'Orbital ortiqcha yuk', description: '9 sayyora - maksimal xaos boshqaruvi' },
    23: { name: 'So\'nggi chegara', description: 'Qalqonlar bilan spiral shaklda ulkan sayyora gigantlari' },
  },
};

// Helper to get level translation
export const getLevelTranslation = (language: Language, levelId: number): LevelTranslation => {
  return levelTranslations[language][levelId] || levelTranslations['en'][levelId] || { name: `Level ${levelId}`, description: '' };
};
