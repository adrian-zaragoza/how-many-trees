
const moveTree = (tree) => {
  let start;

  function step(timestamp){
    if(!start){
      start = timestamp
    }

    let elapsed = timestamp - start;
    tree.style.transform = "translateY(" + Math.min(0.1 * elapsed, 200) + "px)";
    
    if(elapsed < 3000){
      window.requestAnimationFrame(step)
    }
  }

  window.requestAnimationFrame(step)
}


const runTreeAnimation = (carbonTotal) => {
  let numOfTrees = Math.ceil(carbonTotal / 48);
  let treeContainer = document.getElementById("tree-icon-container");




    for(let i = 0; i < numOfTrees; i++){
    let treeIcon = document.createElement("div");
    treeIcon.setAttribute("id", `tree-icon-${i}`);
    treeIcon.classList.add('add-tree-icon');
    treeContainer.appendChild(treeIcon);

    treeIcon.style.top = (Math.random() * -300) + window.scrollY + "px";
    treeIcon.style.left = Math.floor(Math.random() * window.innerWidth) + "px";

    moveTree(treeIcon)
  }

}

export default runTreeAnimation;