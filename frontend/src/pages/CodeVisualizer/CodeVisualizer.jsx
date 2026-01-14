import React, { useState, useRef } from "react";

function CodeVisualizer() {
	const defaultCode = `// Example: Queue Visualization
const q = new Queue(5);
q.enqueue(10);
q.enqueue(20);
q.enqueue(30);
console.log(q.dequeue());
q.enqueue(40);
console.log(q.display());`;

	const [userCode, setUserCode] = useState(defaultCode);
	const [output, setOutput] = useState([]);
	const [visualizationData, setVisualizationData] = useState(null);
	const [isRunning, setIsRunning] = useState(false);
	const [executionSpeed, setExecutionSpeed] = useState(1000);
	const [currentLine, setCurrentLine] = useState(-1);
	const codeEditorRef = useRef();
	const visualizationRef = useRef();

	// Supported data structures
	const supportedStructures = ["Queue", "Stack", "LinkedList", "Tree", "Graph", "Array"];

	const executeCode = async () => {
		setIsRunning(true);
		setOutput([]);
		setVisualizationData(null);
		setCurrentLine(-1);

		try {
			const logs = [];
			const visualizationSteps = [];

			const originalLog = console.log;
			console.log = (...args) => {
				logs.push(args.join(" "));
				originalLog(...args);
			};

			const visualizationHooks = {
				queue: [],
				stack: [],
				array: [],
				linkedList: [],
				tree: null,
				graph: null,
			};

			// ---- Visualization Classes ----
			class VisualQueue {
				constructor(size) {
					this.size = size;
					this.queue = new Array(size).fill(null);
					this.front = -1;
					this.rear = -1;
					visualizationHooks.queue = [...this.queue];
					visualizationSteps.push({
						type: "queue_create",
						size,
						queue: [...this.queue],
						front: this.front,
						rear: this.rear,
						message: `Created queue with size ${size}`,
					});
				}
				enqueue(element) {
					if (this.rear === this.size - 1) {
						visualizationSteps.push({
							type: "queue_error",
							message: "Queue overflow! Cannot enqueue, queue is full.",
							queue: [...this.queue],
							front: this.front,
							rear: this.rear,
						});
						return "Queue is full!";
					}
					if (this.front === -1) this.front = 0;
					this.rear++;
					this.queue[this.rear] = element;
					visualizationSteps.push({
						type: "queue_enqueue",
						element,
						position: this.rear,
						queue: [...this.queue],
						front: this.front,
						rear: this.rear,
						message: `Enqueued: ${element} at position ${this.rear}`,
					});
					visualizationHooks.queue = [...this.queue];
					return `Enqueued: ${element}`;
				}
				dequeue() {
					if (this.front === -1) {
						visualizationSteps.push({
							type: "queue_error",
							message: "Queue underflow! Cannot dequeue from empty queue.",
							queue: [...this.queue],
							front: this.front,
							rear: this.rear,
						});
						return "Queue is empty!";
					}
					const element = this.queue[this.front];
					this.queue[this.front] = null;
					visualizationSteps.push({
						type: "queue_dequeue",
						element,
						position: this.front,
						queue: [...this.queue],
						front: this.front,
						rear: this.rear,
						message: `Dequeued: ${element} from position ${this.front}`,
					});
					if (this.front === this.rear) {
						this.front = -1;
						this.rear = -1;
					} else this.front++;
					visualizationHooks.queue = [...this.queue];
					return `Dequeued: ${element}`;
				}
				display() {
					visualizationSteps.push({
						type: "queue_display",
						queue: [...this.queue],
						front: this.front,
						rear: this.rear,
						message: `Queue contents: [${this.queue.join(", ")}]`,
					});
					return this.queue;
				}
			}

			class VisualStack {
				constructor(size) {
					this.size = size;
					this.stack = new Array(size).fill(null);
					this.top = -1;
					visualizationHooks.stack = [...this.stack];
					visualizationSteps.push({
						type: "stack_create",
						size,
						stack: [...this.stack],
						top: this.top,
						message: `Created stack with size ${size}`,
					});
				}
				push(element) {
					if (this.top === this.size - 1) {
						visualizationSteps.push({
							type: "stack_error",
							message: "Stack overflow! Cannot push, stack is full.",
							stack: [...this.stack],
							top: this.top,
						});
						return "Stack is full!";
					}
					this.top++;
					this.stack[this.top] = element;
					visualizationSteps.push({
						type: "stack_push",
						element,
						position: this.top,
						stack: [...this.stack],
						top: this.top,
						message: `Pushed: ${element} to position ${this.top}`,
					});
					visualizationHooks.stack = [...this.stack];
					return `Pushed: ${element}`;
				}
				pop() {
					if (this.top === -1) {
						visualizationSteps.push({
							type: "stack_error",
							message: "Stack underflow! Cannot pop from empty stack.",
							stack: [...this.stack],
							top: this.top,
						});
						return "Stack is empty!";
					}
					const element = this.stack[this.top];
					this.stack[this.top] = null;
					this.top--;
					visualizationSteps.push({
						type: "stack_pop",
						element,
						position: this.top + 1,
						stack: [...this.stack],
						top: this.top,
						message: `Popped: ${element} from position ${this.top + 1}`,
					});
					visualizationHooks.stack = [...this.stack];
					return `Popped: ${element}`;
				}
				display() {
					visualizationSteps.push({
						type: "stack_display",
						stack: [...this.stack],
						top: this.top,
						message: `Stack contents: [${this.stack.join(", ")}]`,
					});
					return this.stack;
				}
			}

			class VisualArray {
				constructor(...elements) {
					this.array = elements;
					visualizationHooks.array = [...this.array];
					visualizationSteps.push({
						type: "array_create",
						array: [...this.array],
						message: `Created array: [${this.array.join(", ")}]`,
					});
				}
				push(element) {
					this.array.push(element);
					visualizationSteps.push({
						type: "array_push",
						element,
						array: [...this.array],
						message: `Pushed: ${element}`,
					});
					visualizationHooks.array = [...this.array];
					return this.array;
				}
				pop() {
					const element = this.array.pop();
					visualizationSteps.push({
						type: "array_pop",
						element,
						array: [...this.array],
						message: `Popped: ${element}`,
					});
					visualizationHooks.array = [...this.array];
					return element;
				}
				get(index) {
					visualizationSteps.push({
						type: "array_access",
						index,
						element: this.array[index],
						array: [...this.array],
						message: `Accessed index ${index}: ${this.array[index]}`,
					});
					return this.array[index];
				}
				set(index, value) {
					const oldValue = this.array[index];
					this.array[index] = value;
					visualizationSteps.push({
						type: "array_set",
						index,
						oldValue,
						newValue: value,
						array: [...this.array],
						message: `Set index ${index}: ${oldValue} → ${value}`,
					});
					visualizationHooks.array = [...this.array];
					return this.array;
				}
			}

			const context = {
				Queue: VisualQueue,
				Stack: VisualStack,
				Array: VisualArray,
				console: {
					log: (...args) => logs.push(args.join(" ")),
				},
				Math,
				Date,
				String,
				Number,
				Boolean,
				Object,
			};

			const userFunction = new Function(
				...Object.keys(context),
				`'use strict';
        try {
          ${userCode}
        } catch(e) {
          console.log(\`Runtime Error: \${e.message}\`);
        }`
			);

			userFunction(...Object.values(context));
			console.log = originalLog;

			setOutput(logs);
			setVisualizationData({
				steps: visualizationSteps,
				currentStep: 0,
				hooks: visualizationHooks,
			});

			if (visualizationSteps.length > 0) {
				await runVisualization(visualizationSteps);
			}
		} catch (error) {
			setOutput([`Fatal Execution Error: ${error.message}`]);
			console.error("Fatal execution error:", error);
		} finally {
			setIsRunning(false);
		}
	};

	const runVisualization = async (steps) => {
		for (let i = 0; i < steps.length; i++) {
			setCurrentLine(i);
			setVisualizationData((prev) => ({
				...prev,
				currentStep: i,
				currentAction: steps[i],
			}));
			await new Promise((r) => setTimeout(r, executionSpeed));
		}
		setCurrentLine(-1);
	};

	const resetExecution = () => {
		setIsRunning(false);
		setOutput([]);
		setVisualizationData(null);
		setCurrentLine(-1);
	};

	const handleSpeedChange = (speed) => setExecutionSpeed(1000 / speed);

	return (
		<div className="code-visualizer fade-in">
			<div className="visualizer-header">
				<h1>🧪 Code to Visualization</h1>
				<p>Write your DSA code and see it visualized in real-time</p>
			</div>

			<div className="code-visualizer-container">
				{/* Left Panel */}
				<div className="left-panel">
					<div className="code-editor-container glass">
						<div className="editor-header">
							<h3>📝 Your Code</h3>
							<div className="editor-actions">
								<button
									className={`btn primary-btn ${isRunning ? "disabled" : ""}`}
									onClick={executeCode}
									disabled={isRunning}
								>
									{isRunning ? "🔄 Running..." : "🚀 Run Code"}
								</button>
								<button
									className="btn secondary-btn"
									onClick={resetExecution}
									disabled={isRunning}
								>
									🔄 Reset
								</button>
							</div>
						</div>

						<div className="code-editor-wrapper">
							<textarea
								ref={codeEditorRef}
								className="code-editor"
								value={userCode}
								onChange={(e) => setUserCode(e.target.value)}
								spellCheck="false"
							/>
							<div className="editor-line-numbers">
								{userCode.split("\n").map((_, index) => (
									<div
										key={index}
										className={`line-number ${
											currentLine === index ? "active" : ""
										}`}
									>
										{index + 1}
									</div>
								))}
							</div>
						</div>

						<div className="speed-controls">
							<label>Animation Speed:</label>
							<select
								value={1000 / executionSpeed}
								onChange={(e) => handleSpeedChange(Number(e.target.value))}
								disabled={isRunning}
							>
								<option value={0.5}>0.5x</option>
								<option value={1}>1x</option>
								<option value={2}>2x</option>
								<option value={4}>4x</option>
								<option value={8}>8x</option>
							</select>
						</div>
					</div>

					{/* Output */}
					<div className="output-console glass">
						<h3>📊 Output</h3>
						<div className="console-content">
							{output.length
								? output.map((line, i) => (
										<div key={i} className="console-line">
											{line}
										</div>
								  ))
								: "Output will appear here..."}
						</div>
					</div>
				</div>

				{/* Right Panel */}
				<div className="right-panel">
					<div className="visualization-container glass">
						<h3>🎨 Live Visualization</h3>
						{visualizationData ? (
							<VisualizationRenderer
								data={visualizationData}
								currentStep={visualizationData.currentStep}
							/>
						) : (
							<div className="visualization-placeholder">
								<h4>Visualization Ready</h4>
								<p>Click "Run Code" to see it in action!</p>
								<div className="structure-tags">
									{supportedStructures.map((s) => (
										<span key={s} className="structure-tag">
											{s}
										</span>
									))}
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

// Visualization Renderer
function VisualizationRenderer({ data, currentStep }) {
	const currentAction = data.steps[currentStep];
	if (!currentAction) return null;

	switch (currentAction.type) {
		case "queue_create":
		case "queue_enqueue":
		case "queue_dequeue":
		case "queue_display":
			return <div>{currentAction.message}</div>;
		case "stack_create":
		case "stack_push":
		case "stack_pop":
		case "stack_display":
			return <div>{currentAction.message}</div>;
		case "array_create":
		case "array_push":
		case "array_pop":
		case "array_access":
		case "array_set":
			return <div>{currentAction.message}</div>;
		default:
			return <div>{currentAction.message}</div>;
	}
}

export default CodeVisualizer;
