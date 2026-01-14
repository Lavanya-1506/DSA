// Stack implementation and operations
export class Stack {
  constructor() {
    this.items = [];
    this.capacity = 100; // Default capacity
    this.animations = [];
  }

  // Push operation
  push(element) {
    const animations = [];
    
    if (this.isFull()) {
      animations.push({
        type: 'error',
        message: `Stack overflow! Cannot push ${element}, stack is full.`,
        element: element,
        stack: [...this.items]
      });
      return { stack: this, animations };
    }

    animations.push({
      type: 'push-start',
      message: `Pushing ${element} onto the stack...`,
      element: element,
      stack: [...this.items]
    });

    this.items.push(element);

    animations.push({
      type: 'push-success',
      message: `Successfully pushed ${element}. New top: ${element}`,
      element: element,
      stack: [...this.items],
      topIndex: this.items.length - 1
    });

    return { stack: this, animations };
  }

  // Pop operation
  pop() {
    const animations = [];
    
    if (this.isEmpty()) {
      animations.push({
        type: 'error',
        message: 'Stack underflow! Cannot pop from empty stack.',
        stack: [...this.items]
      });
      return { element: null, animations };
    }

    const element = this.items[this.items.length - 1];
    
    animations.push({
      type: 'pop-start',
      message: `Popping element from stack... Current top: ${element}`,
      element: element,
      stack: [...this.items],
      topIndex: this.items.length - 1
    });

    this.items.pop();

    animations.push({
      type: 'pop-success',
      message: `Successfully popped ${element}. ${this.isEmpty() ? 'Stack is now empty' : `New top: ${this.peek().element}`}`,
      element: element,
      stack: [...this.items],
      topIndex: this.items.length - 1
    });

    return { element, animations };
  }

  // Peek operation
  peek() {
    const animations = [];
    
    if (this.isEmpty()) {
      animations.push({
        type: 'error',
        message: 'Stack is empty! No top element.',
        stack: [...this.items]
      });
      return { element: null, animations };
    }

    const element = this.items[this.items.length - 1];
    
    animations.push({
      type: 'peek',
      message: `Top element is: ${element}`,
      element: element,
      stack: [...this.items],
      topIndex: this.items.length - 1
    });

    return { element, animations };
  }

  // Check if stack is empty
  isEmpty() {
    return this.items.length === 0;
  }

  // Check if stack is full
  isFull() {
    return this.items.length >= this.capacity;
  }

  // Get stack size
  size() {
    return this.items.length;
  }

  // Clear stack
  clear() {
    const animations = [];
    const previousSize = this.items.length;
    
    animations.push({
      type: 'clear-start',
      message: `Clearing stack with ${previousSize} elements...`,
      stack: [...this.items]
    });

    this.items = [];

    animations.push({
      type: 'clear-success',
      message: 'Stack cleared successfully!',
      stack: [...this.items],
      clearedCount: previousSize
    });

    return { stack: this, animations };
  }

  // Search for an element
  search(element) {
    const animations = [];
    let found = false;
    let position = -1;

    animations.push({
      type: 'search-start',
      message: `Searching for ${element} in stack...`,
      element: element,
      stack: [...this.items]
    });

    // Search from top to bottom (LIFO order)
    for (let i = this.items.length - 1; i >= 0; i--) {
      animations.push({
        type: 'check-element',
        message: `Checking element at position ${this.items.length - i - 1} from top: ${this.items[i]}`,
        element: this.items[i],
        index: i,
        positionFromTop: this.items.length - i - 1,
        stack: [...this.items]
      });

      if (this.items[i] === element) {
        found = true;
        position = this.items.length - i - 1;
        
        animations.push({
          type: 'found',
          message: `Found ${element} at position ${position} from top!`,
          element: element,
          index: i,
          positionFromTop: position,
          stack: [...this.items]
        });
        break;
      }
    }

    if (!found) {
      animations.push({
        type: 'not-found',
        message: `${element} not found in stack.`,
        element: element,
        stack: [...this.items]
      });
    }

    return { found, position, animations };
  }

  // Display stack contents
  display() {
    const animations = [];
    
    if (this.isEmpty()) {
      animations.push({
        type: 'display-empty',
        message: 'Stack is empty.',
        stack: [...this.items]
      });
    } else {
      animations.push({
        type: 'display',
        message: `Stack contents (top to bottom): ${this.items.slice().reverse().join(' ← ')}`,
        stack: [...this.items],
        topIndex: this.items.length - 1
      });
    }

    return { stack: this, animations };
  }

  // Set capacity
  setCapacity(newCapacity) {
    const animations = [];
    
    if (newCapacity < this.items.length) {
      animations.push({
        type: 'error',
        message: `Cannot set capacity to ${newCapacity}. Current size (${this.items.length}) exceeds new capacity.`,
        currentSize: this.items.length,
        newCapacity: newCapacity
      });
    } else {
      this.capacity = newCapacity;
      animations.push({
        type: 'capacity-set',
        message: `Stack capacity set to ${newCapacity}.`,
        newCapacity: newCapacity,
        currentSize: this.items.length
      });
    }

    return { stack: this, animations };
  }

  // Generate random stack
  generateRandomStack(size = 5, min = 1, max = 100) {
    const animations = [];
    this.items = [];
    this.capacity = Math.max(size * 2, 10);

    animations.push({
      type: 'generate-start',
      message: `Generating random stack with ${size} elements...`,
      size: size,
      min: min,
      max: max
    });

    for (let i = 0; i < size; i++) {
      const element = Math.floor(Math.random() * (max - min + 1)) + min;
      this.items.push(element);
      
      animations.push({
        type: 'generate-push',
        message: `Pushed random element: ${element}`,
        element: element,
        stack: [...this.items],
        progress: ((i + 1) / size) * 100
      });
    }

    animations.push({
      type: 'generate-complete',
      message: `Random stack generation complete! Final size: ${this.items.length}`,
      stack: [...this.items],
      finalSize: this.items.length
    });

    return { stack: this, animations };
  }
}

// Stack visualization data generator
export const StackVisualizer = {
  generateStackData(stack, maxHeight = 10) {
    const items = stack.items || [];
    return {
      items: items.map((value, index) => ({
        value: value,
        index: index,
        isTop: index === items.length - 1,
        position: items.length - index - 1
      })),
      size: items.length,
      isEmpty: items.length === 0,
      isFull: items.length >= (stack.capacity || maxHeight),
      topElement: items.length > 0 ? items[items.length - 1] : null
    };
  },

  calculateStackMetrics(stack) {
    const items = stack.items || [];
    return {
      currentSize: items.length,
      capacity: stack.capacity || 100,
      utilization: (items.length / (stack.capacity || 100)) * 100,
      topValue: items.length > 0 ? items[items.length - 1] : 'Empty',
      bottomValue: items.length > 0 ? items[0] : 'Empty'
    };
  }
};

// Stack operations information
export const StackInfo = {
  name: 'Stack',
  description: 'A linear data structure that follows the Last-In-First-Out (LIFO) principle. Elements are added and removed from the same end called the top.',
  operations: {
    push: {
      time: 'O(1)',
      space: 'O(1)',
      description: 'Add an element to the top of the stack'
    },
    pop: {
      time: 'O(1)',
      space: 'O(1)',
      description: 'Remove and return the top element from the stack'
    },
    peek: {
      time: 'O(1)',
      space: 'O(1)',
      description: 'Return the top element without removing it'
    },
    search: {
      time: 'O(n)',
      space: 'O(1)',
      description: 'Search for an element in the stack'
    }
  },
  applications: [
    'Function call management (call stack)',
    'Undo/Redo functionality',
    'Expression evaluation',
    'Backtracking algorithms',
    'Browser history'
  ],
  properties: {
    principle: 'LIFO (Last In, First Out)',
    access: 'Only top element is accessible',
    dynamic: 'Size can grow and shrink',
    implementation: 'Array or Linked List'
  }
};

export default Stack;