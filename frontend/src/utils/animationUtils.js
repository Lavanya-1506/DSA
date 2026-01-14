export const animateSorting = (animations, arrayBars, speed = 50) => {
  for (let i = 0; i < animations.length; i++) {
    const animation = animations[i];
    const arrayBarsStyle = arrayBars.children;
    
    switch (animation.type) {
      case 'compare':
        setTimeout(() => {
          const [barOneIdx, barTwoIdx] = animation.indices;
          const barOneStyle = arrayBarsStyle[barOneIdx].style;
          const barTwoStyle = arrayBarsStyle[barTwoIdx].style;
          
          barOneStyle.backgroundColor = '#ff6b6b';
          barTwoStyle.backgroundColor = '#ff6b6b';
        }, i * speed);
        break;
        
      case 'swap':
        setTimeout(() => {
          const [barOneIdx, barTwoIdx] = animation.indices;
          const barOneStyle = arrayBarsStyle[barOneIdx].style;
          const barTwoStyle = arrayBarsStyle[barTwoIdx].style;
          
          const tempHeight = barOneStyle.height;
          barOneStyle.height = barTwoStyle.height;
          barTwoStyle.height = tempHeight;
        }, i * speed);
        break;
        
      case 'sorted':
        setTimeout(() => {
          const barStyle = arrayBarsStyle[animation.index].style;
          barStyle.backgroundColor = '#4CAF50';
        }, i * speed);
        break;
    }
  }
};

export const animateSearch = (animations, arrayElements, speed = 500) => {
  for (let i = 0; i < animations.length; i++) {
    const animation = animations[i];
    
    setTimeout(() => {
      switch (animation.type) {
        case 'check':
          arrayElements[animation.index].classList.add('searching');
          break;
          
        case 'found':
          arrayElements[animation.index].classList.remove('searching');
          arrayElements[animation.index].classList.add('found');
          break;
          
        case 'eliminate':
          const [start, end] = animation.indices;
          for (let j = start; j <= end; j++) {
            arrayElements[j].classList.add('eliminated');
          }
          break;
          
        case 'not-found':
          arrayElements.forEach(element => {
            element.classList.add('not-found');
          });
          break;
      }
    }, i * speed);
  }
};

export const resetAnimation = (elements) => {
  elements.forEach(element => {
    element.style.backgroundColor = '';
    element.classList.remove('searching', 'found', 'eliminated', 'not-found');
  });
};
