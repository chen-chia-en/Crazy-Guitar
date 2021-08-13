const cursor = document.querySelector('.cursor')
// let title = document.querySelector("#title")

const x_center = cursor.offsetWidth / 2;
const y_center = cursor.offsetHeight / 2;
// important!!! 在這裡的cursor effect 要用e.pageX e.pageY
document.body.addEventListener('mousemove', (e) => {
    cursor.style.left = `${e.pageX - x_center}px`
    cursor.style.top = `${e.pageY - y_center}px`
})

title.addEventListener("mouseenter",function(){
    cursor.classList.add('active')
})
title.addEventListener("mouseleave",function(){
    cursor.classList.remove('active')
})

// tilt js
VanillaTilt.init(document.querySelectorAll(".product-card"), {
    max: 25,
    speed: 400
});

// song

let play_icon = document.querySelectorAll('.playmusic')
let audio = document.querySelector('.song')
let music = [
    'song/p1_Trim.mp4',
    'song/p2.trim.mp4',
    'song/p3.trim.mp4',
    'song/p4.trim.mp4',
    'song/p5.trim.mp4',
    'song/p6.trim.mp4'
]


play_icon.forEach((value,index)=>{
    value.addEventListener('click', e =>{
        if(audio.paused){
            audio.src = music[index]
            audio.play()
            play_icon[index].classList.remove('fa-play-circle')
            play_icon[index].classList.add('fa-pause-circle')
        }
        else{
            play_icon[index].classList.add('fa-play-circle')
            play_icon[index].classList.remove('fa-pause-circle')
            audio.src = music[index]
            audio.pause()
            audio.currentTime = 0;
        }
    })
})

// purchase
document.getElementById('purchase').addEventListener('click', ()=>{
    alert('Thank you for your purchase!') 
    // 當還存在 hasChildNodes 時，不斷回圈刪除第一個，直到結束。因為不確定Cart中道地有幾個product，因此使用while迴圈
    // hasChildNodes()方法返回一個boolen ;  node.removeChild(child), node 是 child 的父節點
    // node.firstChild 返回第一個子節點
    while (add_product.hasChildNodes()) {
        add_product.removeChild(add_product.firstChild)
    }
    updateCartTotal()
 })

//  cart
// querySelectorAll('.add') 是Nodelist
 let add_item_btn = document.querySelectorAll('.add')
 let add_product = document.querySelector('.add-product')

 add_item_btn.forEach((value,index)=>{
    value.addEventListener('click', e=>{
        let creatdiv = document.createElement('div')
        let image = document.getElementsByClassName("product-img")[index].src
        let price = document.getElementsByClassName("money")[index].innerText
        // 付費區
        let pay_img = document.getElementsByClassName('pay-img')
        // add to cart
        creatdiv.innerHTML =`
            <div class="pay-product">
                <img class="pay-img" src="${image}" alt="" >
                <div class="pay-bill">${price}</div>
                <input class="input-num" type="number" value="1">
                <button class="delete">Delete</button>
                <span id="seperate-line"></span>
            </div>`
        // avoid repeated place order
        // important!!! return 之後就不會執行後面的code，也就是不會add_product.append(creatdiv)
        for (let i=0; i < pay_img.length; i++){
            if(pay_img[i].src == image){
                alert('This item is already added to the cart')
                return
            }
        }
        // 前面先檢查cart中是否有此件物品，再決定是否添加append
        add_product.append(creatdiv)
        updateCartTotal()

        // 這裡不可使用querySelectorall('.delete')，因為querySelectorall回傳的是「靜態的物件」，不過像delete
        // 會不斷增加或刪除，這就是動態的，必須用getElementsByClassName('delete')。
        // getElementsByClassName('delete') 是HTMLCollection ; querySelectorall返回nodelist 
        // 皆不為Array沒有forEach() method，
        // 但回傳Nodelist的querySelectorall，可以用forEach()，但HTMLCollection不行，只能用for loop
        let removeCartItemButtons = add_product.getElementsByClassName('delete')
        for (let i = 0; i < removeCartItemButtons.length; i++){
            removeCartItemButtons[i].addEventListener('click', removeCartItem)
        }
        // 待結帳cart區
        let pay_product = document.getElementsByClassName('pay-product')
        for (let i = 0; i < pay_product.length; i++){
            let input_value = document.getElementsByClassName('input-num')
            input_value[i].addEventListener("change",changeQuantity)
        }
        
     })
 })
//  delete item
function removeCartItem(event) {
    // 這裡的 event.target 表示觸發事件的元素 <button class="delete">Delete</button>
    let buttonClicked = event.target
    // remove  <div class="pay-product"></div>
    buttonClicked.parentElement.remove()
    updateCartTotal()
}

// change quantity
let changeQuantity = (event)=>{
    // 這裡的 event.target 表示觸發事件的元素<input class="input-num" type="number" value="1">
    var input = event.target
    // isNaN()若回傳True 也就是()中的不是數字
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1
    }
    updateCartTotal()
}
// total price
let total_price = document.querySelector('.total-price')
let pay_product = document.getElementsByClassName('pay-product')

function updateCartTotal(){
    // 每次updateCartTotal()，total都會歸零，從頭開始for loop
    let total = 0
    // 每次新增物件，全部在cart中的價格都跑過一遍
    for (let i=0 ; i < pay_product.length; i++ ){
        
        let input_value = document.getElementsByClassName('input-num')[i]
        let pay_bill = document.getElementsByClassName('pay-bill')[i]

        // parseInt() 把string 變成整數 
        let money = parseInt(pay_bill.innerText.replace('$', '')) 
        
        let quantity = input_value.value

        total = total + (money * quantity)
    }
    total_price.innerText = "$" + `${total}`
}

// Function:
// 函式運算式 var xxx = function() {...}   vs.    函式宣告 function xxx() {...} 
// 前者函式運算式，定義的函式在宣告前使用，會出現錯誤;  後者函式宣告，定義的函式可以在宣告前使用 ; 

// square(2);    // TypeError: square is not a function
// var square = function (number) {
//     return number * number;
//   };

// square(2);    // 4
// function square(number) {
//   return number * number;
// }



// e.target     vs.     e.currentTarget 等同於this
// 前者指向addEventListener 被觸發的物件，後者當function(){...,false/空元素}時，「冒泡事件」，把事件逐層传递上去，直到根元素为止(最上層的元素)
// 當function(){...,True} 時，「捕獲事件」，事件會從這個元素的祖先元素逐層傳遞下來。
