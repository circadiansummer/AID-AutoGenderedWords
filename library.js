// ============================================================
// AutoGenderedWords
// Version 1.1.0-beta.1
// ============================================================
//
// AutoGenderedWords automatically selects gendered wording
// based on the player's answer to:
//
// ${What is your gender?}
//
// IMPORTANT:
// The Scenario MUST contain that exact placeholder somewhere.
//
// ------------------------------------------------------------
// CREATOR SYNTAX
// ------------------------------------------------------------
//
// :masculine,feminine,neutral:
//
// Examples:
//
// :he,she,they:
// :He,She,They:
// :him,her,them:
// :his,her,their:
// :his,hers,theirs:
// :himself,herself,themself:
// :man,woman,person:
// :boy,girl,child:
// :father,mother,parent:
// :dad,mom,parent:
// :son,daughter,child:
// :brother,sister,sibling:
// :husband,wife,spouse:
// :king,queen,monarch:
// :is,is,are:
// :was,was,were:
// :has,has,have:
//
// Spaces around choices are allowed:
//
// :he,she,they:
// :he, she, they:
// : he , she , they :
//
// Slashes may appear inside choices:
//
// :he/him,she/her,they/them:
//
// Commas and colons are reserved delimiters.
//
// ------------------------------------------------------------
// SUPPORTED LOCATIONS
// ------------------------------------------------------------
//
// - Opening Story Text
// - Plot Essentials
// - Author's Note
// - Existing Story Card entries
// - Existing Story Card trigger keys
// - Existing Story Card titles/names when exposed by runtime
//
// Story Summary and AI Instructions are not supported.
//
// ------------------------------------------------------------
// RUNTIME
// ------------------------------------------------------------
//
// AutoGenderedWords performs one initialization pass at the
// very beginning of the Adventure.
//
// After initialization completes, all later calls immediately
// return without scanning or modifying anything.
//
// ============================================================

const AutoGenderedWords = (() => {

  const VERSION = "1.1.0-beta.1";

  const STATE_KEY = "autoGenderedWords";

  const GENDER_QUESTION = "What is your gender?";

  const DEBUG = true;


  // ==========================================================
  // AGW WORD SET
  // ==========================================================
  //
  // Matches exactly three comma-separated choices enclosed
  // by colons.
  //
  // Examples:
  //
  // :he,she,they:
  // :he, she, they:
  // : he , she , they :
  //
  // Individual choices may contain spaces, slashes,
  // apostrophes, periods, hyphens, etc.
  //
  // Choices cannot contain commas, colons, or line breaks.
  // ==========================================================

  const WORD_SET =
    /:([^:,\r\n]+),([^:,\r\n]+),([^:,\r\n]+):/g;


  // ==========================================================
  // GENDER ANSWER VOCABULARY
  // ==========================================================

  const TERMS = {

    // Explicit neutral/nonbinary indicators.
    // These take priority if present.

    neutral: [
      "nonbinary",
      "non binary",
      "enby",
      "nb",

      "gender neutral",
      "neutral",

      "they",
      "them",
      "they them",

      "agender",

      "genderqueer",

      "genderfluid",
      "gender fluid",

      "gender nonconforming",
      "gender non conforming",

      "nonconforming",
      "non conforming"
    ],


    // Masculine indicators.

    masculine: [
      "male",
      "man",
      "boy",

      "masculine",
      "masc",

      "he",
      "him",
      "he him",

      "cis male",
      "cis man",

      "cisgender male",
      "cisgender man",

      "trans male",
      "trans man",

      "transgender male",
      "transgender man",

      "transmasculine",
      "trans masculine",

      "guy",
      "gentleman",
      "dude"
    ],


    // Feminine indicators.

    feminine: [
      "female",
      "woman",
      "girl",

      "feminine",
      "fem",

      "she",
      "her",
      "she her",

      "cis female",
      "cis woman",

      "cisgender female",
      "cisgender woman",

      "trans female",
      "trans woman",

      "transgender female",
      "transgender woman",

      "transfeminine",
      "trans feminine",

      "lady",
      "gal"
    ]

  };


  // ==========================================================
  // LOGGING
  // ==========================================================

  function debug(message) {

    if (DEBUG) {
      console.log(
        "[AutoGenderedWords] " + message
      );
    }

  }


  // ==========================================================
  // STATE
  // ==========================================================

  function getState() {

    state[STATE_KEY] =
      state[STATE_KEY] || {};

    return state[STATE_KEY];

  }


  // ==========================================================
  // NORMALIZATION
  // ==========================================================
  //
  // Examples:
  //
  // he/him       -> he him
  // she/her      -> she her
  // non-binary   -> non binary
  // trans-male   -> trans male
  // ==========================================================

  function normalize(value) {

    return String(value || "")
      .toLowerCase()
      .replace(/[_-]+/g, " ")
      .replace(/[^a-z0-9]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  }


  // ==========================================================
  // WHOLE-TERM MATCHING
  // ==========================================================
  //
  // Prevents matches such as:
  //
  // "male" inside "female"
  // ==========================================================

  function containsTerm(
    normalized,
    term
  ) {

    const needle =
      normalize(term);

    if (!needle) {
      return false;
    }


    return (
      ` ${normalized} `
        .includes(
          ` ${needle} `
        )
    );

  }


  // ==========================================================
  // CLASSIFY PLAYER ANSWER
  // ==========================================================

  function classify(answer) {

    const normalized =
      normalize(answer);


    // --------------------------------------------------------
    // Single-letter answers.
    // --------------------------------------------------------

    if (normalized === "m") {
      return "masculine";
    }

    if (normalized === "f") {
      return "feminine";
    }


    // --------------------------------------------------------
    // Explicit neutral/nonbinary wording takes priority.
    // --------------------------------------------------------

    const neutral =
      TERMS.neutral.some(
        term =>
          containsTerm(
            normalized,
            term
          )
      );


    if (neutral) {
      return "neutral";
    }


    // --------------------------------------------------------
    // Masculine / feminine indicators.
    // --------------------------------------------------------

    const masculine =
      TERMS.masculine.some(
        term =>
          containsTerm(
            normalized,
            term
          )
      );


    const feminine =
      TERMS.feminine.some(
        term =>
          containsTerm(
            normalized,
            term
          )
      );


    if (
      masculine &&
      !feminine
    ) {
      return "masculine";
    }


    if (
      feminine &&
      !masculine
    ) {
      return "feminine";
    }


    // --------------------------------------------------------
    // Unknown, empty, ambiguous, or contradictory answers
    // use the third / neutral option.
    // --------------------------------------------------------

    return "neutral";

  }


  // ==========================================================
  // MODE -> SLOT
  // ==========================================================

  function modeToSlot(mode) {

    if (mode === "masculine") {
      return 0;
    }

    if (mode === "feminine") {
      return 1;
    }

    return 2;

  }


  // ==========================================================
  // RESOLVE AGW WORD SETS
  // ==========================================================

  function resolveWordSets(
    value,
    mode
  ) {

    if (
      typeof value !== "string" ||
      value.length === 0
    ) {

      return {
        text: value,
        count: 0
      };

    }


    const slot =
      modeToSlot(mode);

    let count = 0;


    const resolved =
      value.replace(

        WORD_SET,

        (
          _match,
          masculine,
          feminine,
          neutral
        ) => {

          const choices = [
            masculine.trim(),
            feminine.trim(),
            neutral.trim()
          ];


          count += 1;


          return choices[slot];

        }

      );


    return {
      text: resolved,
      count
    };

  }


  // ==========================================================
  // FIND GENDER PLACEHOLDER ANSWER
  // ==========================================================
  //
  // Requires the exact Scenario placeholder:
  //
  // ${What is your gender?}
  //
  // AI Dungeon stores the text inside ${ } as question.
  // ==========================================================

  function findGenderAnswer() {

    if (
      !Array.isArray(
        state.placeholders
      )
    ) {
      return null;
    }


    const match =
      state.placeholders.find(
        placeholder =>
          placeholder &&
          placeholder.question ===
            GENDER_QUESTION
      );


    if (
      !match ||
      match.answer === undefined ||
      match.answer === null
    ) {
      return null;
    }


    return String(
      match.answer
    ).trim();

  }


  // ==========================================================
  // PLOT ESSENTIALS
  // ==========================================================

  function processPlotEssentials(mode) {

    if (
      !state.memory ||
      typeof state.memory.context !== "string"
    ) {
      return 0;
    }


    const result =
      resolveWordSets(
        state.memory.context,
        mode
      );


    state.memory.context =
      result.text;


    return result.count;

  }


  // ==========================================================
  // AUTHOR'S NOTE
  // ==========================================================

  function processAuthorsNote(mode) {

    if (
      !state.memory ||
      typeof state.memory.authorsNote !== "string"
    ) {
      return 0;
    }


    const result =
      resolveWordSets(
        state.memory.authorsNote,
        mode
      );


    state.memory.authorsNote =
      result.text;


    return result.count;

  }


  // ==========================================================
  // EXISTING STORY CARDS
  // ==========================================================
  //
  // Processes every Story Card already present when the
  // Adventure starts, whether or not that card is currently
  // triggered.
  //
  // Supported Story Card fields:
  //
  // - Entry
  // - Trigger keys
  // - Title/name when the runtime exposes that field
  //
  // Type and other metadata are left unchanged.
  //
  // AI Dungeon officially exposes Entry, keys, and Type to
  // scripts. Title/name is handled defensively because some
  // runtimes expose it on the Story Card object even though
  // the documented updateStoryCard() signature does not.
  // ==========================================================

  function processStoryCards(mode) {

    let entryReplacements = 0;

    let keyReplacements = 0;

    let titleReplacements = 0;

    let cardsChanged = 0;


    if (
      !Array.isArray(
        storyCards
      )
    ) {

      return {
        replacements: 0,
        entryReplacements,
        keyReplacements,
        titleReplacements,
        cardsChanged
      };

    }


    for (
      let i = 0;
      i < storyCards.length;
      i++
    ) {

      const card =
        storyCards[i];


      if (!card) {
        continue;
      }


      const entryResult =
        resolveWordSets(
          card.entry,
          mode
        );


      const keyResult =
        resolveWordSets(
          card.keys,
          mode
        );


      let titleField =
        null;


      if (
        typeof card.title === "string"
      ) {
        titleField =
          "title";
      }
      else if (
        typeof card.name === "string"
      ) {
        titleField =
          "name";
      }


      const titleResult =
        resolveWordSets(
          titleField
            ? card[titleField]
            : "",
          mode
        );


      const supportedFieldChanged =
        entryResult.count > 0 ||
        keyResult.count > 0;


      if (supportedFieldChanged) {

        updateStoryCard(
          i,
          keyResult.text,
          entryResult.text,
          card.type
        );

      }


      if (
        titleField &&
        titleResult.count > 0
      ) {

        const updatedCard =
          storyCards[i] || card;


        updatedCard[titleField] =
          titleResult.text;

      }


      const cardReplacementCount =
        entryResult.count +
        keyResult.count +
        titleResult.count;


      if (
        cardReplacementCount === 0
      ) {
        continue;
      }


      entryReplacements +=
        entryResult.count;

      keyReplacements +=
        keyResult.count;

      titleReplacements +=
        titleResult.count;

      cardsChanged += 1;

    }


    return {
      replacements:
        entryReplacements +
        keyReplacements +
        titleReplacements,
      entryReplacements,
      keyReplacements,
      titleReplacements,
      cardsChanged
    };

  }


  // ==========================================================
  // ONE-TIME STARTUP PASS
  // ==========================================================

  function run(text) {

    const agwState =
      getState();


    // --------------------------------------------------------
    // AutoGenderedWords has already completed.
    //
    // Every later Input hook becomes an immediate no-op.
    // --------------------------------------------------------

    if (
      agwState.completed === true
    ) {
      return text;
    }


    // --------------------------------------------------------
    // Only initialize on the Adventure's opening action.
    // --------------------------------------------------------

    if (
      typeof info !== "undefined" &&
      info &&
      typeof info.actionCount === "number" &&
      info.actionCount !== 0
    ) {
      return text;
    }


    agwState.attempted =
      true;

    agwState.version =
      VERSION;


    // --------------------------------------------------------
    // Locate the required gender answer.
    // --------------------------------------------------------

    const answer =
      findGenderAnswer();


    if (answer === null) {

      agwState.error =
        "missing_gender_placeholder";


      debug(
        "ERROR: Could not find the exact " +
        "Scenario placeholder " +
        "\"\${What is your gender?}\". " +
        "Initialization aborted."
      );


      return text;

    }


    // --------------------------------------------------------
    // Classify answer.
    // --------------------------------------------------------

    const mode =
      classify(answer);


    agwState.answer =
      answer;

    agwState.mode =
      mode;


    // --------------------------------------------------------
    // Resolve the Opening Story Text.
    //
    // At actionCount 0, Input text is the Story Start before
    // it is committed as the Adventure's first start action.
    // --------------------------------------------------------

    const storyStartResult =
      resolveWordSets(
        text,
        mode
      );


    // --------------------------------------------------------
    // Resolve persistent Scenario content.
    // --------------------------------------------------------

    const plotEssentialsReplacements =
      processPlotEssentials(
        mode
      );


    const authorsNoteReplacements =
      processAuthorsNote(
        mode
      );


    const cardResult =
      processStoryCards(
        mode
      );


    // --------------------------------------------------------
    // Save completion state.
    // --------------------------------------------------------

    const totalReplacements =
      storyStartResult.count +
      plotEssentialsReplacements +
      authorsNoteReplacements +
      cardResult.replacements;


    agwState.completed =
      true;

    agwState.storyStartReplacements =
      storyStartResult.count;

    agwState.plotEssentialsReplacements =
      plotEssentialsReplacements;

    agwState.authorsNoteReplacements =
      authorsNoteReplacements;

    agwState.storyCardReplacements =
      cardResult.replacements;

    agwState.storyCardEntryReplacements =
      cardResult.entryReplacements;

    agwState.storyCardKeyReplacements =
      cardResult.keyReplacements;

    agwState.storyCardTitleReplacements =
      cardResult.titleReplacements;

    agwState.storyCardsChanged =
      cardResult.cardsChanged;

    agwState.totalReplacements =
      totalReplacements;


    // --------------------------------------------------------
    // Diagnostic log.
    //
    // Nothing here is displayed to the player.
    // --------------------------------------------------------

    debug(
      "Initialization complete: " +
      "answer=\"" +
      answer +
      "\"; " +
      "mode=" +
      mode +
      "; storyStart=" +
      storyStartResult.count +
      "; plotEssentials=" +
      plotEssentialsReplacements +
      "; authorsNote=" +
      authorsNoteReplacements +
      "; storyCards=" +
      cardResult.replacements +
      "; storyCardEntries=" +
      cardResult.entryReplacements +
      "; storyCardKeys=" +
      cardResult.keyReplacements +
      "; storyCardTitles=" +
      cardResult.titleReplacements +
      "; storyCardsChanged=" +
      cardResult.cardsChanged +
      "; total=" +
      totalReplacements
    );


    // --------------------------------------------------------
    // Returning this modified text makes the gender-resolved
    // Story Start visible to the player.
    // --------------------------------------------------------

    return storyStartResult.text;

  }


  // ==========================================================
  // PUBLIC API
  // ==========================================================

  return {
    run
  };

})();
