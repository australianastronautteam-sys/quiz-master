// ===== BAD CODE =====
// These should be flagged by the context

function badIndentTab() {
console.log("This uses a tab, not 2 spaces");
}

function badIndent4Spaces() {
    console.log("This uses 4 spaces, not 2");
}

if(true){
      console.log("This uses 6 spaces, wrong indentation");
}

// ===== GOOD CODE =====
// These should pass

function goodIndent() {
  console.log("This uses 2 spaces correctly");
}

if (true) {
  console.log("2-space indentation is consistent");
}

async function fetchData() {
  try {
    const data = await getData();
  } catch(e) {
    console.error(e);
  }
}

const example = () => {
  console.log("Arrow function with proper 2-space indentation");
};
