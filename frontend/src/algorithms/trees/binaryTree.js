// Binary Search Tree implementation and operations
export class BinaryTreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.parent = null;
    this.height = 1;
  }
}

export class BinarySearchTree {
  constructor() {
    this.root = null;
    this.size = 0;
  }

  // Insert a value into the BST
  insert(value) {
    const animations = [];
    const newNode = new BinaryTreeNode(value);
    
    if (!this.root) {
      this.root = newNode;
      animations.push({
        type: 'insert-root',
        value: value,
        node: this.getNodeInfo(newNode)
      });
    } else {
      this.insertNode(this.root, newNode, animations);
    }
    
    this.size++;
    return { tree: this, animations };
  }

  insertNode(node, newNode, animations) {
    animations.push({
      type: 'compare',
      current: this.getNodeInfo(node),
      value: newNode.value
    });

    if (newNode.value < node.value) {
      if (!node.left) {
        node.left = newNode;
        newNode.parent = node;
        animations.push({
          type: 'insert-left',
          parent: this.getNodeInfo(node),
          node: this.getNodeInfo(newNode)
        });
      } else {
        this.insertNode(node.left, newNode, animations);
      }
    } else {
      if (!node.right) {
        node.right = newNode;
        newNode.parent = node;
        animations.push({
          type: 'insert-right',
          parent: this.getNodeInfo(node),
          node: this.getNodeInfo(newNode)
        });
      } else {
        this.insertNode(node.right, newNode, animations);
      }
    }
  }

  // Search for a value in the BST
  search(value) {
    const animations = [];
    const result = this.searchNode(this.root, value, animations);
    return { found: result !== null, animations };
  }

  searchNode(node, value, animations) {
    if (!node) {
      animations.push({
        type: 'not-found',
        value: value
      });
      return null;
    }

    animations.push({
      type: 'visit',
      node: this.getNodeInfo(node),
      value: value
    });

    if (value === node.value) {
      animations.push({
        type: 'found',
        node: this.getNodeInfo(node),
        value: value
      });
      return node;
    } else if (value < node.value) {
      animations.push({
        type: 'go-left',
        node: this.getNodeInfo(node),
        value: value
      });
      return this.searchNode(node.left, value, animations);
    } else {
      animations.push({
        type: 'go-right',
        node: this.getNodeInfo(node),
        value: value
      });
      return this.searchNode(node.right, value, animations);
    }
  }

  // Delete a value from the BST
  delete(value) {
    const animations = [];
    this.root = this.deleteNode(this.root, value, animations);
    if (animations[animations.length - 1].type !== 'not-found') {
      this.size--;
    }
    return { tree: this, animations };
  }

  deleteNode(node, value, animations) {
    if (!node) {
      animations.push({
        type: 'not-found',
        value: value
      });
      return null;
    }

    animations.push({
      type: 'visit',
      node: this.getNodeInfo(node),
      value: value
    });

    if (value < node.value) {
      animations.push({
        type: 'go-left',
        node: this.getNodeInfo(node),
        value: value
      });
      node.left = this.deleteNode(node.left, value, animations);
    } else if (value > node.value) {
      animations.push({
        type: 'go-right',
        node: this.getNodeInfo(node),
        value: value
      });
      node.right = this.deleteNode(node.right, value, animations);
    } else {
      animations.push({
        type: 'found-delete',
        node: this.getNodeInfo(node),
        value: value
      });

      // Case 1: No child
      if (!node.left && !node.right) {
        animations.push({
          type: 'delete-no-child',
          node: this.getNodeInfo(node)
        });
        return null;
      }

      // Case 2: One child
      if (!node.left) {
        animations.push({
          type: 'delete-right-child',
          node: this.getNodeInfo(node),
          replacement: this.getNodeInfo(node.right)
        });
        return node.right;
      } else if (!node.right) {
        animations.push({
          type: 'delete-left-child',
          node: this.getNodeInfo(node),
          replacement: this.getNodeInfo(node.left)
        });
        return node.left;
      }

      // Case 3: Two children
      const minNode = this.findMinNode(node.right);
      animations.push({
        type: 'find-successor',
        node: this.getNodeInfo(node),
        successor: this.getNodeInfo(minNode)
      });

      node.value = minNode.value;
      node.right = this.deleteNode(node.right, minNode.value, animations);
    }

    return node;
  }

  findMinNode(node) {
    while (node && node.left) {
      node = node.left;
    }
    return node;
  }

  // Tree traversals
  inOrderTraversal() {
    const animations = [];
    const result = [];
    this.inOrder(this.root, result, animations);
    return { result, animations };
  }

  inOrder(node, result, animations) {
    if (node) {
      animations.push({
        type: 'go-left',
        node: this.getNodeInfo(node)
      });
      this.inOrder(node.left, result, animations);

      animations.push({
        type: 'visit',
        node: this.getNodeInfo(node)
      });
      result.push(node.value);

      animations.push({
        type: 'go-right',
        node: this.getNodeInfo(node)
      });
      this.inOrder(node.right, result, animations);
    }
  }

  preOrderTraversal() {
    const animations = [];
    const result = [];
    this.preOrder(this.root, result, animations);
    return { result, animations };
  }

  preOrder(node, result, animations) {
    if (node) {
      animations.push({
        type: 'visit',
        node: this.getNodeInfo(node)
      });
      result.push(node.value);

      animations.push({
        type: 'go-left',
        node: this.getNodeInfo(node)
      });
      this.preOrder(node.left, result, animations);

      animations.push({
        type: 'go-right',
        node: this.getNodeInfo(node)
      });
      this.preOrder(node.right, result, animations);
    }
  }

  postOrderTraversal() {
    const animations = [];
    const result = [];
    this.postOrder(this.root, result, animations);
    return { result, animations };
  }

  postOrder(node, result, animations) {
    if (node) {
      animations.push({
        type: 'go-left',
        node: this.getNodeInfo(node)
      });
      this.postOrder(node.left, result, animations);

      animations.push({
        type: 'go-right',
        node: this.getNodeInfo(node)
      });
      this.postOrder(node.right, result, animations);

      animations.push({
        type: 'visit',
        node: this.getNodeInfo(node)
      });
      result.push(node.value);
    }
  }

  // Utility methods
  getHeight(node = this.root) {
    if (!node) return 0;
    return Math.max(this.getHeight(node.left), this.getHeight(node.right)) + 1;
  }

  isBalanced(node = this.root) {
    if (!node) return true;

    const leftHeight = this.getHeight(node.left);
    const rightHeight = this.getHeight(node.right);

    if (Math.abs(leftHeight - rightHeight) <= 1 &&
        this.isBalanced(node.left) &&
        this.isBalanced(node.right)) {
      return true;
    }

    return false;
  }

  getNodeInfo(node) {
    if (!node) return null;
    return {
      value: node.value,
      hasLeft: !!node.left,
      hasRight: !!node.right,
      height: node.height
    };
  }

  // Generate random tree for visualization
  generateRandomTree(size = 10, min = 1, max = 100) {
    this.root = null;
    this.size = 0;
    const animations = [];

    for (let i = 0; i < size; i++) {
      const value = Math.floor(Math.random() * (max - min + 1)) + min;
      this.insert(value);
    }

    return { tree: this, animations };
  }

  // Convert tree to array for visualization
  toArray() {
    const result = [];
    this.traverseForArray(this.root, result, 0, 0);
    return result;
  }

  traverseForArray(node, result, level, position) {
    if (!node) return;

    if (!result[level]) {
      result[level] = [];
    }

    result[level][position] = node.value;

    this.traverseForArray(node.left, result, level + 1, position * 2);
    this.traverseForArray(node.right, result, level + 1, position * 2 + 1);
  }
}

// Tree visualization utilities
export const TreeVisualizer = {
  // Calculate node positions for visualization
  calculateNodePositions(root, width = 800, height = 400) {
    const positions = [];
    const levelHeight = height / (this.getTreeHeight(root) + 1);

    this.calculatePositionsRecursive(root, positions, width / 2, 50, width / 4, levelHeight, 0);

    return positions;
  },

  calculatePositionsRecursive(node, positions, x, y, xOffset, levelHeight, level) {
    if (!node) return;

    positions.push({
      value: node.value,
      x: x,
      y: y,
      level: level,
      hasLeft: !!node.left,
      hasRight: !!node.right
    });

    if (node.left) {
      this.calculatePositionsRecursive(
        node.left,
        positions,
        x - xOffset,
        y + levelHeight,
        xOffset / 2,
        levelHeight,
        level + 1
      );
    }

    if (node.right) {
      this.calculatePositionsRecursive(
        node.right,
        positions,
        x + xOffset,
        y + levelHeight,
        xOffset / 2,
        levelHeight,
        level + 1
      );
    }
  },

  getTreeHeight(node) {
    if (!node) return 0;
    return 1 + Math.max(
      this.getTreeHeight(node.left),
      this.getTreeHeight(node.right)
    );
  },

  // Generate tree data for D3 visualization
  generateTreeData(root) {
    if (!root) return null;

    return {
      name: root.value.toString(),
      value: root.value,
      children: [
        root.left ? this.generateTreeData(root.left) : null,
        root.right ? this.generateTreeData(root.right) : null
      ].filter(Boolean)
    };
  }
};

// Export tree operations info
export const BinaryTreeInfo = {
  name: 'Binary Search Tree',
  description: 'A binary tree where each node has at most two children, and for each node, all left descendants are less than the node and all right descendants are greater.',
  operations: {
    insert: {
      time: 'O(log n) average, O(n) worst',
      space: 'O(1)',
      description: 'Insert a new value while maintaining BST properties'
    },
    search: {
      time: 'O(log n) average, O(n) worst',
      space: 'O(1)',
      description: 'Find a value in the tree'
    },
    delete: {
      time: 'O(log n) average, O(n) worst',
      space: 'O(1)',
      description: 'Remove a value from the tree'
    },
    traversal: {
      time: 'O(n)',
      space: 'O(h) where h is tree height',
      description: 'Visit all nodes in specific order'
    }
  },
  properties: {
    balanced: 'Height difference between subtrees ≤ 1',
    complete: 'All levels except possibly last are completely filled',
    full: 'Every node has either 0 or 2 children',
    perfect: 'All internal nodes have two children and all leaves at same level'
  }
};

export default BinarySearchTree;
