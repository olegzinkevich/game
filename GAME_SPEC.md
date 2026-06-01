# Game Specification

## Meta
- **Title:** GarageTuning
- **Category:** Simulation
- **Screen Orientation:** the game should be playable in album orientation
- **Platforms:** the game should be available in mobile AND desktop platforms
- **Framework:** React
- **Game Code Path:** Use this reference game code and edit it: `D:\dev\yandex_game_7_car`
- **Yandex Metrika Counter ID:** 123
- **Testing Checklist:** `D:\dev\yandex_game_7_car\Testing_checklist.md`

## Game Description
This game - is a simple car tuning game, where a user (given a base car image) without wheels, color, bumpers, etc.) can click on different slots, representing parts of the car (located below the car image), for example - bumper, wheels, lights, etc. When user clicks, for example, bumber - the area with available bumber desing will open. (the app should take bumper desings from corresponding folder, located at public folder where the bumper images are located). User clicks on one of the desings of a bumper, the app takes the corresponding png image and overlays it on base car image located at the center of the screen. Then user can select other details (lights, or roof), again can choose the necessary design and save final image with all overlaya 

Available folders - 
lights
bumpers
rear wings
wheels
vinyl decal
roof
glasses
car hoods

## Keywords
тюнинг автомобилей, дизайн автомобилей, тюнинг деталей, игра с тюнингом, авто тюнинг, кастомизация машин, симулятор тюнинга

## Onboarding Screens
Change the existing onboarding screens with these if they differ in reference code:

### Russian (source)
#### Screen 1
**Question:** Как много времени у вас на игру?

1. <3 мин.
2. 5-10 мин.
3. >15 мин.

#### Screen 2
**Question:** Играли ли Вы раньше в симуляторы?

1. Да, много раз
2. Играл иногда
3. Почти не играл

## Assets
- Logo: `./public/logo.png`
- Maskable Icon: `./public/maskable.png`
- Catalog Cover: `./public/cover.png`

## Localization
The game should be localized (i18n) in these languages: Russian, English

### Russian

#### SEO Text
Эта игра — симулятор тюнинга автомобилей! Настраивайте свою машину, выбирая бамперы, колеса и другие детали для уникального дизайна.

#### About the game
Эта игра предлагает уникальный опыт автомобильного тюнинга, позволяя вам настраивать свой собственный автомобиль с нуля. Начните с базового изображения машины без колес, цвета, бамперов и других деталей. Просто щелкните на различные слоты под изображением автомобиля, чтобы выбрать отдельные элементы, такие как бамперы, колеса, фары и многое другое. Например, выбрав бампер, вы получите доступ к множеству дизайнов, которые можно просмотреть и применить к вашему автомобилю. Все изображения загружаются из соответствующих папок, расположенных в публичной директории. Вы можете дополнительно изменить вид автомобиля, выбирая задние крылья, виниловые наклейки, стекла и капоты. Игра предлагает режимы одиночной игры, где вы можете сосредоточиться на своем творении, а также мультиплеерный режим, позволяющий делиться своими тюнингованными автомобилями с друзьями и соревноваться с ними. Откройте для себя все возможности и создайте уникальный автомобиль, который будет отражать ваш стиль!

#### How to play
Эта игра — простой симулятор настройки автомобилей. Для начала выберите детали, которые хотите изменить, на панели ниже изображения автомобиля. Вы можете настроить бамперы, колеса, фары и другие элементы. Например, кликните на бампер, чтобы открыть доступные дизайны из соответствующей папки. Выберите один из дизайнов, и он наложится на базовое изображение вашего автомобиля. После этого можете выбрать другие детали, такие как крыша или виниловая наклейка, и повторить процесс выбора. Когда все детали будут выбраны, вы можете сохранить финальное изображение с наложением. Убедитесь, что вы выбрали все желаемые элементы, прежде чем сохранять, так как изменения нельзя будет отменить. Учтите, что доступные папки с изображениями: бамперы, колеса, фары, крыши, задние крылья, виниловые наклейки, стекла и капоты. Удачной настройки!

### English

#### SEO Text
This game is a car tuning simulator! Customize your ride with bumpers, wheels, and other parts for a unique look.

#### About the game
This game offers a unique car tuning experience, allowing you to build your own vehicle from the ground up. Start with a basic car model stripped of wheels, color, bumpers, and other components. Simply click on various slots beneath the car image to select individual elements like bumpers, wheels, headlights, and more. For instance, by choosing a bumper, you'll gain access to numerous designs that you can preview and apply to your vehicle. All images are loaded from designated folders in the public directory. You can further customize your car’s appearance by selecting rear fenders, vinyl stickers, windows, and hoods. The game features single-player modes where you can focus on your creation, as well as multiplayer options that allow you to share your tuned cars with friends and compete against them. Discover all the possibilities and create a unique car that reflects your style!

#### How to play
This game is a simple car customization simulator. To get started, select the parts you want to modify from the panel below the car image. You can customize bumpers, wheels, headlights, and other components. For instance, click on the bumper to access the available designs from the corresponding folder. Choose one of the designs, and it will overlay on the base image of your car. After that, you can pick other parts, like the roof or a vinyl sticker, and repeat the selection process. Once all parts are chosen, you can save the final image with the overlay. Make sure you've selected all the desired elements before saving, as changes cannot be undone. Note that the available image folders include: bumpers, wheels, headlights, roofs, rear fenders, vinyl stickers, windows, and hoods. Happy customizing!

---

## Instructions for Claude

You are given a reference game codebase in the folder defined in "Game Code Path". Update it to match the specification above:

0. Read the testing checklist at `D:\dev\yandex_game_7_car\Testing_checklist.md` and follow all checks and instructions when generating and verifying the game.
1. Set the game title, description, and metadata in the appropriate config / manifest files.
2. Wire up the Yandex Games SDK — use the orientation, platform, and metrika counter values.
3. Place the provided assets (logo, maskable icon, cover) in the correct locations.
4. Implement i18n localization for all listed languages (localize all game strings, necessary assets, button texts, messages, onboarding screens, etc.).
5. Implement the onboarding screens as described — each screen has a question title and selectable options.
6. If reference screenshots are listed, READ each image file using the Read tool to view them. Analyze the color palette, art style, UI layout, and design patterns. Apply these as visual style guidance for any generated UI, theme colors, and overall aesthetic.
7. Use the specified framework for the implementation.
