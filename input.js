const modifier = (text) => {

  text =
    AutoGenderedWords.run(text);

  return { text };

};


// Don't modify this part
modifier(text);
