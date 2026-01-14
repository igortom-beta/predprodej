# Instrukce pro nasazení webu Lojzovy Paseky

## Co se změnilo

Upravil jsem váš projekt tak, aby:
1. **Používal GPT-4 mini** místo Gemini (vaše API key)
2. **Měl moderní design** podle vašeho obrázku (tmavý hero, zelené prvky, navigace)
3. **Fungoval na Vercel** bez dalších problémů

## Změněné soubory

1. **server/_core/llm.ts**
   - Změna modelu: `gemini-2.5-flash` → `gpt-4.1-mini`
   - Odebrány Gemini-specifické parametry (thinking)
   - Nastaveny vhodné tokeny pro GPT-4 mini

2. **client/src/pages/Home.tsx**
   - Nový moderní design s tmavým hero sectionem
   - Navigační menu (O projektu, Apartmány, Lokalita, Kontakt)
   - Zelené akcenty (barva #22c55e) podle vašeho designu
   - Integrován FloatingChatWidget s AI asistentem

## Jak nasadit

### Krok 1: Stáhněte si upravené soubory
Soubory jsou připraveny v adresáři `/home/ubuntu/lojzovypaseky/`

### Krok 2: Pushněte na GitHub
```bash
cd /cesta/k/vašemu/projektu
git add -A
git commit -m "Aktualizace: moderní design + GPT-4 mini"
git push origin main
```

### Krok 3: Vercel automaticky nasadí
- Vercel bude sledovat GitHub
- Jakmile pushneš, automaticky se spustí build
- Za pár minut bude web živý na lojzovypaseky.info

## Ověření na Vercel

Ujistěte se, že na Vercel máte nastavenu proměnnou:
- `OPENAI_API_KEY` = váš OpenAI API klíč

To je vše, co potřebujete!

## Funkce AI asistenta

AI asistent nyní:
- Odpovídá v češtině, němčině, angličtině a dalších jazycích
- Počítá ceny pronájmu
- Poskytuje informace o projektu
- Umí se chovat jako prodejce

Vše je napojeno na váš OpenAI API klíč, takže se bude účtovat podle vašeho tarifu.

## Pokud něco nefunguje

1. Zkontrolujte, že `OPENAI_API_KEY` je na Vercel správně nastavena
2. Podívejte se na Vercel logs (Deployments → Build logs)
3. Zkontrolujte, že jste pushli všechny soubory na GitHub

## Kontakt

Pokud máte otázky, jsem tu pro vás!
