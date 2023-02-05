<template>
  <div :style="{ background: '#fff', padding: '24px', minHeight: '280px' }">
    <Markdown :source="source" />
  </div>
</template>

<script>
import Markdown from "vue3-markdown-it";

export default {
  components: {
    Markdown,
  },
  data() {
    return {
      source:
        "" +
        "# Zadání FE - GPS Dozor\n" +
        "  **Použijte VUE3, případně VUE2**\n" +
        "\n" +
        "  Vyrobte znovupoužitelný dotazníkový formulář, který bude fungovat násedovně:\n" +
        "\n" +
        "  - někde globálně budeme mít uložené otázky s odpověďmi (stačí připravit 2-3 otázky, náhodný počet odpovědí)\n" +
        "    - LEHČÍ: export / import\n" +
        "    - SLOŽITĚJŠÍ: fetch / axios (json)\n" +
        "  - formulář bude mít tolik kroků kolik bude otázek + dva další (začátek a vyhodnocení) po zmáčknutí tlačítka začít se zobrazí první otázka (otázky se zobrazují v náhodném pořadí)\n" +
        "    - SLOŽITĚJŠÍ: umíme reset aplikace (znovu začít)\n" +
        "  - až po zvolení odpovědi se odemče tlačidlo na další krok a odpověď se vyhodnotí\n" +
        "  - po zodpovězení všech otázek se zobrazí vyhodnocení (kolik bylo otázek, kolik správných odpovedí, kolik nesprávných odpovědí, procentuální úspěšnost a délka trvání práce s dotazníkem (od zmáčknutí začít až po vstup na vyhodnocení)\n" +
        "  - SLOŽITĚJŠÍ: uchováme svoje skóre a zobrazíme max 5 záznamů seřazených dle procentuální úspěšnosti a následně nejrychlejších vyplnení (data uchováme lokálně)\n" +
        "\n" +
        "  Zadání odevzdejte ve formě GIT repositáře.",
    };
  },
};
</script>
