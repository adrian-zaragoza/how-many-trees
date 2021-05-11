const moveTree = (tree) => {
  let start;

  function step(timestamp){
    if(!start){
      start = timestamp
    }

    let elapsed = timestamp - start;
    tree.style.transform = "translateY(" + Math.min(1 * elapsed, 800) + "px)";
    
    if(elapsed < 3000){
      window.requestAnimationFrame(step)
    }
  }

  window.requestAnimationFrame(step)
}



const runTreeAnimation = (carbonTotal) => {
  let numOfTrees = Math.ceil(carbonTotal / 48);
  let treeContainer = document.getElementById("tree-icon-container");

  let treeAmountText = document.createElement("h1")
  
  treeAmountText.textContent = `${numOfTrees} ${(numOfTrees === 1) ? 'Tree' : 'Trees'}`;
  treeAmountText.classList.add('grow');
  treeContainer.appendChild(treeAmountText);

  for(let i = 0; i < numOfTrees; i++){
    let treeIcon = document.createElement("div");
    treeIcon.setAttribute("id", `tree-icon-${i}`);
    treeIcon.classList.add('add-tree-icon');
    treeContainer.appendChild(treeIcon);

    treeIcon.style.top = (Math.random() * - 800) + window.scrollY + "px";
    treeIcon.style.left = Math.floor(Math.random() * (window.innerWidth - 75)) + "px";
    
    moveTree(treeIcon)
  }

  const removeChildNodes = (parentEle)=>{
    while(parentEle.firstChild){
        parentEle.removeChild(parentEle.firstChild);
    }
}

  window.setTimeout(() => {
    let treeContainer = document.getElementById("tree-icon-container");
    removeChildNodes(treeContainer);
  }, 2500);

}

export default runTreeAnimation;