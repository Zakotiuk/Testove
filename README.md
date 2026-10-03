# SauceDemo — автоматизовані E2E-тести

Тестове завдання, реалізоване на JavaScript із Playwright Test та Page Object Model. Тести перевіряють авторизацію, роботу з кошиком і сортування каталогу.

## Передумови
- Node.js.
- Доступ до інтернету для встановлення залежностей і роботи із SauceDemo.
- Підтримувана Playwright операційна система: [системні вимоги](https://playwright.dev/docs/intro#system-requirements).

У проєкті налаштований запуск у Chromium. Локальний сервер застосунку не потрібен.

## Встановлення
Склонуйте репозиторій або завантажте його архів. Відкрийте термінал у корені проєкту, де розташований `package.json`.

Встановіть залежності з `package-lock.json`:
```bash
npm ci
```

Встановіть Chromium для Playwright:
```bash
npx playwright install chromium
```

Для Linux разом із системними залежностями:
```bash
npx playwright install --with-deps chromium
```

## Налаштування тестових користувачів
Створіть `.env` у корені проєкту, скопіювавши `.env.example`:
```bash
cp .env.example .env
```

У Windows PowerShell:
```powershell
Copy-Item .env.example .env
```

Шаблон містить публічні демонстраційні облікові дані SauceDemo:
```dotenv
E2E_USERNAME=standard_user
E2E_PASSWORD=secret_sauce
E2E_LOCKED_OUT_USERNAME=locked_out_user
```
Усі три змінні потрібні для повного запуску. Конфігурація завантажує `.env` через `dotenv`. Файл `.env` виключений із Git через `.gitignore`.

## Запуск тестів
Усі тести в Chromium без видимого вікна браузера:
```bash
npm test
```

Усі тести з відкритим вікном браузера:
```bash
npm run test-ui
```

## Звіт і діагностика

Після запуску HTML-звіт зберігається в `playwright-report/`. Відкрити його:
```bash
npx playwright show-report
```
Результати й допоміжні файли зберігаються в `test-results/`. Обидві директорії виключені з Git.

За поточним конфігом trace записується на першій повторній спробі в CI. Щоб зберегти trace локального падіння:
```bash
npm test -- --trace=retain-on-failure
```

## Покриття

| Файл | Сценарії |
| --- | --- |
| `tests/login-page.spec.js` | Успішний логін і непорожній каталог; неправильний пароль; заблокований користувач; обов'язкові поля; успішний логін після неправильного пароля |
| `tests/cart-page.spec.js` | Додавання двох товарів; видалення одного з двох товарів; видалення останнього товару |
| `tests/inventory-list-page.spec.js` | Сортування `Price (high to low)` і `Name (Z to A)`; видалення товару через каталог |

Кожен тест самостійно готує потрібний стан. Тест видалення товару не залежить від результату тесту додавання. Сценарії з перевіркою повного каталогу очікують 6 товарів у демонстраційному застосунку.

## Структура проєкту

- `tests/` — тестові сценарії та перевірки результатів.
- `pages/` — Page Object: локатори, дії та допоміжні перевірки сторінок.
- `fixtures/e2e-tests-fixture.js` — створення Page Object для кожного тесту.
- `playwright.config.js` — адреса застосунку, браузер, паралельність, повторні спроби та звіт.
- `.github/workflows/playwright.yml` — workflow GitHub Actions.