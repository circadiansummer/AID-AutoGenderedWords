# AutoGenderedWords

### Automatic gender-aware wording for AI Dungeon scenarios

**Current Version:** 0.1.0-beta.1

---

## Overview

AutoGenderedWords is an AI Dungeon scenario script that allows creators to write gender-variable text without asking players to manually select every pronoun, relationship term, title, or other gendered word.

The creator writes three possible versions of a word using a simple format:

~~~text
:masculine,feminine,neutral:
~~~

When a player starts the scenario, AutoGenderedWords reads their response to:

~~~text
${What is your gender?}
~~~

The script classifies that response as **masculine**, **feminine**, or **neutral/unknown**, then automatically selects the corresponding word throughout supported scenario content.

For example:

~~~text
:He,She,They: is the king's :son,daughter,child:.
~~~

If the player answers "woman", the Adventure begins with:

~~~text
She is the king's daughter.
~~~

AutoGenderedWords performs this setup once when the Adventure begins. It does not continuously monitor or rewrite the Adventure during gameplay.

---

## Main Features

| Feature | Description |
| --- | --- |
| Automatic Gender Detection | Reads the player's answer to ${What is your gender?} |
| Three-Way Word Selection | Supports masculine, feminine, and gender-neutral wording |
| Simple Creator Syntax | Write :he,she,they: directly while building the scenario |
| Visible Story Start Replacement | Gendered wording is resolved before the Opening Story Text is shown to the player |
| Plot Component Support | Processes Plot Essentials and Author's Note at Adventure startup |
| Story Card Support | Processes the Entry of every Story Card present when the Adventure begins |
| Flexible Vocabulary | Creators are not restricted to a predefined list of gendered words |
| Neutral Fallback | Unknown or ambiguous gender answers automatically use the third option |
| One-Time Processing | Performs its work at Adventure startup instead of scanning every turn |
| No Extra Player Prompts | Only the normal ${What is your gender?} Scenario placeholder is required |

---

# ⚠️ Creator Setup Is Required

**Installing the JavaScript by itself is not enough.**

AutoGenderedWords requires the Scenario creator to prepare their Scenario using two specific rules.

Every Scenario using AutoGenderedWords must:

1. Include the exact ${What is your gender?} placeholder.
2. Write gender-variable wording using :masculine,feminine,neutral: syntax.

If either requirement is missing, AutoGenderedWords cannot perform its intended function.

---

# Creator Rule #1: Gender Prompt

Your Scenario must contain this exact AI Dungeon placeholder:

~~~text
${What is your gender?}
~~~

The text inside the placeholder is important.

Use:

~~~text
${What is your gender?}
~~~

Do not change it to something like:

~~~text
${Gender?}
${What gender are you?}
${Choose your gender}
${Are you male or female?}
~~~

AutoGenderedWords specifically looks for the answer associated with:

~~~text
What is your gender?
~~~

### Recommended Setup

For the beta, the simplest option is to include the placeholder naturally in either your Opening Story Text or Plot Essentials.

For example, Plot Essentials could contain:

~~~text
Player gender: ${What is your gender?}
~~~

AI Dungeon asks the player the question while creating their Adventure and stores their response.

AutoGenderedWords then reads that response automatically.

The player does **not** need to answer separate prompts such as:

~~~text
${he/she/they}
${him/her/them}
${his/her/their}
~~~

---

# Creator Rule #2: Gendered Word Syntax

Any text AutoGenderedWords should resolve must use:

~~~text
:masculine,feminine,neutral:
~~~

The choices are always interpreted in this order:

~~~text
:first option,second option,third option:
~~~

where:

~~~text
first  = masculine
second = feminine
third  = gender-neutral
~~~

For example:

~~~text
:he,she,they:
~~~

becomes "he" for a masculine player, "she" for a feminine player, and "they" for a neutral or unknown player.

---

## Spaces Are Optional

All of these formats are valid:

~~~text
:he,she,they:
:he, she, they:
: he , she , they :
~~~

AutoGenderedWords trims the extra spaces before inserting the selected word.

Creators can therefore use whichever style is easiest to read while writing.

---

## Capitalization Is Creator-Controlled

AutoGenderedWords does not automatically change capitalization.

Write:

~~~text
:he,she,they:
~~~

for lowercase output.

Write:

~~~text
:He,She,They:
~~~

for sentence-case output.

For example:

~~~text
:He,She,They: looked toward :his,her,their: father.
~~~

---

## Slashes Are Allowed

Slashes can safely appear inside individual choices.

For example:

~~~text
:he/him,she/her,they/them:
~~~

is valid.

The commas—not the slashes—separate the three options.

---

## Reserved Characters

Within an AutoGenderedWords expression:

- : marks the beginning and end.
- , separates the three choices.

Because of this, individual choices should **not contain commas or colons**.

Good:

~~~text
:father,mother,parent:
:he/him,she/her,they/them:
:young man,young woman,young person:
~~~

Avoid:

~~~text
:man, sir,woman, ma'am,person:
~~~

because the commas inside the individual choices would interfere with parsing.

---

# Common Examples

AutoGenderedWords does not use a fixed vocabulary. These are simply useful examples creators can type wherever needed.

### Pronouns

~~~text
:he,she,they:
:him,her,them:
:his,her,their:
:his,hers,theirs:
:himself,herself,themself:
~~~

### General Gender Terms

~~~text
:man,woman,person:
:men,women,people:
:boy,girl,child:
:boys,girls,children:
~~~

### Family

~~~text
:father,mother,parent:
:dad,mom,parent:
:daddy,mommy,parent:
:son,daughter,child:
:brother,sister,sibling:
:grandfather,grandmother,grandparent:
:grandson,granddaughter,grandchild:
:uncle,aunt,relative:
:nephew,niece,nibling:
~~~

### Relationships

~~~text
:husband,wife,spouse:
:boyfriend,girlfriend,partner:
:groom,bride,spouse:
~~~

### Titles

~~~text
:Mr.,Ms.,Mx.:
:king,queen,monarch:
:prince,princess,royal:
:emperor,empress,sovereign:
:duke,duchess,noble:
:lord,lady,noble:
:god,goddess,deity:
~~~

### Grammar

The system can also handle words that change because of singular "they".

~~~text
:is,is,are:
:was,was,were:
:has,has,have:
:does,does,do:
~~~

For example:

~~~text
:He,She,They: :is,is,are: waiting outside.
~~~

can become:

~~~text
They are waiting outside.
~~~

---

# Custom Words Are Supported

The examples above are **not a whitelist**.

Creators can make their own word sets whenever needed.

For example:

~~~text
:warlock,witch,mage:
:patriarch,matriarch,family head:
:sire,dam,parent:
:pretty boy,pretty girl,pretty thing:
~~~

AutoGenderedWords only cares that the expression contains exactly three comma-separated choices between the surrounding colons.

---

# Supported Scenario Fields

AutoGenderedWords 0.1.0-beta.1 supports:

| Scenario Content | Supported? | Notes |
| --- | --- | --- |
| Opening Story Text | ✅ Yes | Player-facing text is visibly resolved before the Adventure begins |
| Plot Essentials | ✅ Yes | Processed during startup |
| Author's Note | ✅ Yes | Processed during startup |
| Existing Story Card Entries | ✅ Yes | Every card present at Adventure startup is processed |
| Story Summary | ❌ No | Not supported in this version |
| AI Instructions | ❌ No | Not supported in this version |

### Story Card Limitation

AutoGenderedWords processes the **Entry** of Story Cards.

It does not process:

- Story Card names/titles
- Triggers/keys
- Story Card types
- Other unsupported metadata

Put AutoGenderedWords syntax inside the Story Card **Entry**.

---

# Story Cards Created Later

AutoGenderedWords is intentionally a one-time initialization script.

It processes Story Cards that already exist when the Adventure starts.

Story Cards created later during gameplay by the player, another script, Auto-Cards, or another automated system are **not processed by AutoGenderedWords**.

Those systems should create their new cards using the already-correct gendered wording.

---

# Gender Detection

AutoGenderedWords places the player's answer into one of three categories:

~~~text
masculine
feminine
neutral
~~~

### Common Masculine Responses

~~~text
male
man
boy
masculine
masc
m
he
him
he/him
cis male
cis man
cisgender male
trans male
trans man
transgender male
transmasculine
guy
gentleman
dude
~~~

### Common Feminine Responses

~~~text
female
woman
girl
feminine
fem
f
she
her
she/her
cis female
cis woman
cisgender female
trans female
trans woman
transgender female
transfeminine
lady
gal
~~~

### Common Neutral Responses

~~~text
nonbinary
non-binary
enby
nb
gender neutral
they
them
they/them
agender
genderqueer
genderfluid
gender nonconforming
~~~

Punctuation differences such as "he/him" versus "he him", or "non-binary" versus "non binary", are normalized before classification.

---

## Unknown Answers

If AutoGenderedWords cannot confidently determine whether an answer is masculine or feminine, it automatically uses the **third option**.

For example, if the player answers:

~~~text
dragon
~~~

then:

~~~text
:man,woman,person:
~~~

becomes:

~~~text
person
~~~

and:

~~~text
:he,she,they:
~~~

becomes:

~~~text
they
~~~

This behavior is intentional.

Unknown, ambiguous, unusual, or contradictory responses should fail safely into gender-neutral language instead of forcing a masculine or feminine selection.

---

# Scenario Script Installation Guide

## 1. Enable Scripts

1. Open AI Dungeon on the web.
2. Create a new Scenario or edit an existing Scenario.
3. Open the Scenario's scripting controls.
4. Enable scripts.
5. Open the script editor.

---

## 2. Install the Library

Open the Library tab.

Copy the complete AutoGenderedWords Library code into it.

If your Scenario already uses other Library code, AutoGenderedWords can coexist with it. Do not remove unrelated Library code unless you intend to.

---

## 3. Install the Input Hook

AutoGenderedWords requires this call inside your Input modifier:

~~~javascript
text = AutoGenderedWords.run(text);
~~~

A basic Input script looks like:

~~~javascript
const modifier = (text) => {
  text = AutoGenderedWords.run(text);
  return { text };
};

modifier(text);
~~~

If you already use other Input scripts, integrate the AutoGenderedWords call into the existing modifier rather than creating multiple separate modifier(text) calls.

For example:

~~~javascript
const modifier = (text) => {
  // Other input scripts can run here.

  text = AutoGenderedWords.run(text);

  // Other input scripts can also run here if appropriate.

  return { text };
};

modifier(text);
~~~

AutoGenderedWords does not require dedicated Context or Output processing.

---

## 4. Add the Required Gender Placeholder

Somewhere in the Scenario, include:

~~~text
${What is your gender?}
~~~

For example:

~~~text
Player gender: ${What is your gender?}
~~~

**Do not skip this step.**

Without the exact gender question, AutoGenderedWords cannot determine which option to select.

---

## 5. Prepare Gendered Text

Replace gender-variable wording with AutoGenderedWords expressions.

Instead of:

~~~text
He is the king's son.
~~~

write:

~~~text
:He,She,They: is the king's :son,daughter,child:.
~~~

For grammar-sensitive text, use:

~~~text
:He,She,They: :is,is,are: the king's :son,daughter,child:.
~~~

---

## 6. Save and Test

Save the Scenario and start a **new Adventure**.

The player should receive the normal AI Dungeon setup question:

~~~text
What is your gender?
~~~

Their answer should automatically determine the words selected from every AutoGenderedWords expression in supported fields.

---

# Full Example

### Creator Writes

Opening Story Text:

~~~text
You return to the palace after years away.

You are a :man,woman,person:, and the guards recognize you as
the missing :son,daughter,child: of the royal family.

:He,She,They: steps toward the gates.
~~~

Plot Essentials:

~~~text
Player gender: ${What is your gender?}

The protagonist is the king's :son,daughter,child:.
The king considers :him,her,them: his rightful heir.
~~~

Author's Note:

~~~text
Treat :him,her,them: as the central protagonist.
:He,She,They: :is,is,are: confident and capable.
~~~

Story Card Entry:

~~~text
Alex is the protagonist's :brother,sister,sibling:.
Alex has always protected :him,her,them:.
~~~

### Player Answers

~~~text
female
~~~

### Adventure Receives

Opening Story:

~~~text
You return to the palace after years away.

You are a woman, and the guards recognize you as
the missing daughter of the royal family.

She steps toward the gates.
~~~

Plot information resolves using "daughter" and "her".

Author's Note resolves using "her", "She", and "is".

The Story Card becomes:

~~~text
Alex is the protagonist's sister.
Alex has always protected her.
~~~

---

# How AutoGenderedWords Works

AutoGenderedWords only performs its main processing at the very beginning of an Adventure.

During startup it:

1. Finds the player's answer to ${What is your gender?}.
2. Classifies the answer as masculine, feminine, or neutral.
3. Resolves AutoGenderedWords expressions in the Opening Story Text.
4. Resolves Plot Essentials.
5. Resolves Author's Note.
6. Resolves every existing Story Card Entry.
7. Marks initialization complete.

After that, AutoGenderedWords does not continue scanning the Adventure.

This keeps the script lightweight and avoids unnecessary replacement work during normal gameplay.

---

# Script Compatibility

AutoGenderedWords is designed to perform a small, one-time startup transformation.

Because its syntax requires:

~~~text
:first,second,third:
~~~

ordinary prose such as:

~~~text
(yes/no/maybe)
~~~

or:

~~~text
[red/green/blue]
~~~

is ignored.

This reduces the chance of accidentally modifying syntax belonging to another script.

Creators using multiple Input scripts should still test the combined Scenario before publishing.

In particular, any other script that modifies the Opening Story Text during actionCount === 0 may interact with AutoGenderedWords depending on execution order.

---

# Troubleshooting

### Nothing Was Replaced

Make sure your Scenario contains the exact placeholder:

~~~text
${What is your gender?}
~~~

Also verify that your word set uses:

~~~text
:first,second,third:
~~~

not:

~~~text
(first/second/third)
~~~

or:

~~~text
[first,second,third]
~~~

### The Wrong Gender Was Selected

Check the player's answer to "What is your gender?"

AutoGenderedWords classifies common gender terms automatically.

Unknown or ambiguous answers intentionally use the third option.

### The Neutral Option Was Selected

This normally means:

- the player gave a neutral/nonbinary response,
- the answer was not recognized,
- or the answer contained conflicting gender indicators.

The third option is the script's safe fallback.

### Opening Story Text Still Shows the Syntax

Verify that your Input script includes:

~~~javascript
text = AutoGenderedWords.run(text);
~~~

and that AutoGenderedWords is installed in Library.

The visible Opening Story replacement depends on the Input hook running during the Adventure's initial action.

### Plot Essentials or Author's Note Still Appear Unchanged in the Editor

AutoGenderedWords modifies the runtime values used during the Adventure.

Do not rely only on the Scenario Creator's original template text to determine whether the script has run.

Use the Adventure and script logs when diagnosing behavior.

### A Story Card Wasn't Updated

Check that:

1. The card existed when the Adventure began.
2. The syntax is inside the Story Card **Entry**.
3. The expression contains exactly three choices.
4. The choices are separated by commas.
5. The expression starts and ends with :.

For example:

~~~text
:brother,sister,sibling:
~~~

### A Story Card Created During Gameplay Wasn't Updated

This is expected.

AutoGenderedWords processes Story Cards only during Adventure initialization.

Cards created afterward are outside its scope.

### Story Summary Didn't Change

Story Summary is not supported in 0.1.0-beta.1.

### AI Instructions Didn't Change

AI Instructions are not supported in 0.1.0-beta.1.

---

# Beta Testing

AutoGenderedWords is currently intended for limited creator testing.

Useful test cases include:

- male
- female
- nonbinary
- he/him
- she/her
- they/them
- an unknown response such as "dragon"
- scenarios containing many Story Cards
- scenarios using other Input scripts
- word sets with spaces
- word sets containing /
- singular-they grammar such as :is,is,are:

If something behaves incorrectly, please include:

- the player's exact gender response,
- the AutoGenderedWords expression involved,
- which Scenario field contained it,
- relevant script logs,
- and any other scripts installed in the Scenario.

---

# Current Limitations

AutoGenderedWords 0.1.0-beta.1 does not currently process:

- Story Summary
- AI Instructions
- Story Card names
- Story Card triggers/keys
- Story Cards created after Adventure startup
- gender-variable text introduced later during gameplay

It is designed specifically to resolve **pre-established Scenario content during Adventure initialization**.

---

# Changelog

## 0.1.0-beta.1

- First limited creator beta.
- Added automatic gender classification from ${What is your gender?}.
- Added masculine, feminine, and neutral/unknown modes.
- Added :masculine,feminine,neutral: creator syntax.
- Added optional whitespace support.
- Added support for / inside individual choices.
- Added visible Opening Story Text replacement.
- Added Plot Essentials support.
- Added Author's Note support.
- Added existing Story Card Entry support.
- Added neutral fallback for unknown or ambiguous answers.
- Restricted processing to Adventure initialization.
- Story Summary intentionally excluded.
- AI Instructions intentionally excluded.

---

# Quick Reference

### Required Prompt

~~~text
${What is your gender?}
~~~

### Required Word Format

~~~text
:masculine,feminine,neutral:
~~~

### Example

~~~text
:He,She,They: :is,is,are: a :man,woman,person:.
~~~

### Supported

~~~text
Opening Story Text
Plot Essentials
Author's Note
Existing Story Card Entries
~~~

### Not Supported

~~~text
Story Summary
AI Instructions
Story Cards created later
~~~

### Unknown Gender Response

Uses the third / neutral option.

---

**AutoGenderedWords v0.1.0-beta.1**

Built for creator-authored AI Dungeon scenarios where one gender question should be enough.
