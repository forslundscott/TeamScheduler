// const { MAX } = require("mssql");

function newWeight() {
    return (Math.random() - 0.5) /0.5;
  }

function newLayerData(inputs){
    var layerData = []
    for(var i = 0; i<inputs; i++){
        layerData.push(0.01 * newWeight())
    }
    return layerData
}

// layer1 data
var weights1 = [
    [0.2, 0.8, -0.5, 1.0],
    [0.5, -0.91, 0.26, -0.5],
    [-0.26, -0.27, 0.17, 0.87]
]
var bias1 = [2, 3, 0.5]

// layer2 data
var weights2 = [
    [0.1, -0.14, 0.5],
    [-0.5, 0.12, -0.33],
    [-0.44, 0.73, -0.13]
]
var bias2 = [-1, 2, -0.5]

// input batches
var batch1 = [
    [1, 2, 3, 2.5],
    [2.0, 5.0, -1.0, 2.0],
    [-1.5, 2.7, 3.3, -0.8]
]

class neuron {
    constructor(inputCount) {
        this.weights = newLayerData(inputCount),
        this.bias = 0
     }
     output(inputs) {
        // console.log(this.weights)
        return dotProduct(this.weights,inputs) + this.bias
    }
  }
class layer {
    constructor(inputCount,neuronCount) {
        this.neurons = []
        this.init(inputCount,neuronCount)
        this.outputs = []
    }
    init(inputCount,neuronCount){
        for(var i=1; i<neuronCount+1; i++){
            // console.log(newLayerData(inputCount), 'test')
            this.neurons.push(new neuron(inputCount))
        } 
    }
    forward(inputs){
        
        var outputs = []
        for(var i=0;i<inputs.length;i++){
            var output = []
            for(var j=0; j<this.neurons.length; j++) {
                output.push(this.neurons[j].output(inputs[i]))
            }
            // console.log(output)
            outputs.push(output)
        }

        this.outputs = outputs
    }
    Relu(inputs){
        var outputs = []
        for(var i=0; i<inputs.length; i++){
            var output = []
            for(var j=0;j<inputs[i].length;j++){
                output.push(Relu(inputs[i][j]))
            }
            outputs.push(output)
        }
        return outputs
    }
}
function Relu(input){
    return Math.max(0,input)
}
function dotProduct(array1, array2) {
    var output = 0.0
    for(var i=0; i<array1.length; i++){
        output += (array1[i] * array2[i])
    }
    return output
}


// softmax activation
// exponentiation
// normalization
var layer_outputs = [
    [4.8, 1.21, 2.385],
    [8.9, -1.81, 0.2],
    [1.41, 1.051, 0.026]
]
// console.time()
// console.log(sm2(layer_outputs))
// console.timeEnd()

// var layer1 = new layer(3,3)
// layer1.forward(layer_outputs)

// console.time()
// console.log(softMax(layer_outputs))

// console.timeEnd()
// console.log(softMax(layer1.outputs))
function sm2(inputs){
    var outputs = []
    // console.log(inputs.length)
    for(var i = 0;i<inputs.length;i++){

        outputs.push(ratioOfArray(exponentiate(inputs[i])))
    }
    return outputs

}
function softMax(inputs){
    // eventually change to not modify the input directly
    for(var i = 0;i<inputs[0].length;i++){
        var total = 0
        for(var j=0;j<inputs[i].length;j++){
            inputs[i][j] = Math.exp(inputs[i][j])
            total += inputs[i][j]
        }
        for(var j=0;j<inputs[i].length;j++){
            inputs[i][j] = inputs[i][j]/total
        }
    }
    return inputs
}
function exponentiate(inputs){
    var output = []
    // console.log(Array.isArray(inputs[0]))
    // console.log(typeof inputs[0])
    for(var i=0;i<inputs.length;i++){
        output.push(Math.exp(inputs[i]))
    }
    return output
}

function ratioOfArray(array){
    var output = []
    var total = sum(array)
    for(var i=0;i<array.length;i++){
        output.push(array[i]/total)
    }
    return output
}
function sum(array){
    var total = 0
    for(var i=0;i<array.length;i++){
        total += array[i]
    }
    return total
}
class categoricalCrossentropy{
    constructor(){

    }
    calculate(output,y){
        // console.log(output.length)
        // console.log(y.length)
        var sample_losses = this.forward(output,y)
        var data_loss = sum(sample_losses)/sample_losses.length
        return data_loss
    }
    forward(predictions,targets){
        var predictionsClipped = clip(predictions,0.000001,1-0.000001)
        // console.log(predictionsClipped.slice(0,5))
        var correct_confidences = []
        for(var i = 0;i<predictionsClipped.length;i++){
            correct_confidences.push(-Math.log(predictionsClipped[i][targets[i]]))
        }
        return correct_confidences
    }

}
// function categoricalCrossentropy(predictions,targets){
//     // var samples = predictions.length
//     var predictionsClipped = clip(predictions,0.0000001,1-0.0000001)
//     var correct_confidences = []
//     for(var i = 0;i<predictionsClipped.length;i++){
//         correct_confidences.push(predictionsClipped[i][targets[i]])
//     }
// }
function clip(array,min,max){
    var outputs = []
    for(var i=0;i<array.length;i++){
        var output = []
        for(var j=0;j<array[i].length;j++){
            output.push(Math.min(Math.max(min,array[i][j]),max))
        }
        outputs.push(output)
    }
    return outputs
}
// var softmax_output = [0.7,0.1,0.2]
// var target_output = [1,0,0]

// var loss = -(Math.log(softmax_output[0])*target_output[0]+
// Math.log(softmax_output[1])*target_output[1]+
// Math.log(softmax_output[2])*target_output[2]
// )
// console.log(loss)
var softmax_outputs = [
    [0.7,0.1,0.2],
    [0.1,0.5,0.4],
    [0.02,0.9,0.08]
]
var class_targets = [0,1,1]
var tempoutputs = []
for(var i=0;i<softmax_outputs.length;i++){
    tempoutputs.push(softmax_outputs[i][class_targets[i]])
}
function zeros(x,y){
    if(y==='dense' || y === undefined || y === null || y === ''){
        return Array.from(Array(x).fill(0))
    }
    return Array.from(new Array(x), _ => Array(y).fill(0))
}
// spiral data

function spiral_data(points, classes) {
    // Using MathJs functions to make matrices with zeros but converting to arrays for simplicity
    const X = zeros(points * classes, 2);
    const y = zeros(points * classes, "dense");
    let ix = 0;
    for (let class_number = 0; class_number < classes; class_number++) {
      let r = 0;
      let t = class_number * 4;
  
      while (r <= 1 && t <= (class_number + 1) * 4) {
        // adding some randomness to t
        const random_t = t + Math.random()*points * 0.008;
        // Was `* 0.2` but reduced so you can somewhat see the arms of spiral in visualization
        // Fell free to change it back
  
        // converting from polar to cartesian coordinates
        X[ix][0] = r * Math.sin(random_t * 2.5);
        X[ix][1] = r * Math.cos(random_t * 2.5);
        y[ix] = class_number;
  
        // the below two statements achieve linspace-like functionality
        r += 1.0 / (points - 1);
        t += 4.0 / (points - 1);
  
        ix++; // increment index
      }
    }
    // Returning as MathJs matrices, could be arrays, doesnt really matter
    // console.log(y)
    return [X, y];
  }
  function spiral_dataNew(points, classes) {
    // Using MathJs functions to make matrices with zeros but converting to arrays for simplicity
    const X = zeros(points * classes, 2);
    const y = zeros(points * classes, "dense");
    let ix = 0;
    for (let class_number = 0; class_number < classes; class_number++) {
      let r =[];
      let t = [];
        r = linspace(0,1,points)
        t = linspace(class_number*4,(class_number+1)*4,points,Math.random()*0.2)
      for(var i = points*class_number;i<points*(class_number+1);i++){
        X[i][0] = r[i-(points*class_number)] * Math.sin(t[i] * 2.5);
        X[i][1] = r[i-(points*class_number)] * Math.cos(t[i] * 2.5);
        y[i] = class_number;
      }
    
    }

    return [X, y];
  }
function linspace(start,stop,number,bias=0){
    var interval = (stop-start)/(number-1)
    var output = []
    for(var i=0;i<number;i++){
        output.push(start+(i*interval)+bias)
        // console.log(start+(i*interval))
    }
    return output
}
function stndDist1(num){
    var total = 0
    for(var i=0;i<num;i++){
        total += newWeight()
        // console.log(total/(i+1))
    }
    console.log(total/(i+1))
}
function stndDist2(num){
    var total = 0
    for(var i=0;i<num;i++){
        
        total += newWeight()
        console.log(total/(i+1))
    }
}
// console.log(linspace(1,50,7))
let [X,y] = spiral_data(100,3)

let matrix = Array.from(new Array(3), _ => Array(5).fill(0))
// console.log(X)
const layer1 = new layer(2,3)
layer1.forward(X)
const act1 = layer1.Relu(layer1.outputs)
const layer2 = new layer(3,3)
layer2.forward(act1)
stndDist1(100)

// console.log(softMax(layer2.outputs).slice(0,5))
// console.log(y.slice(0,5))
// console.log(layer2.outputs.slice(0,5))
const cost = new categoricalCrossentropy()
cost.calculate(softMax(layer2.outputs),y)
// console.log(cost.calculate(softMax(layer2.outputs),y))
// console.log(softMax(layer2.outputs).length)
// console.log(y)
// console.log(tempoutputs)
// console.log(clip(softmax_outputs,0.0000001,1-0.0000001))