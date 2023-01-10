/**
 * 添加水印
 * @param {file} 上传的图片文件
 */
 export async function addWaterMarker(file) {
  // 先将文件转成img标签
  let img = await blobToImg(file)
  // console.log(img)
  return new Promise((resolve, reject) => {
    // 创建canvas画布
    let canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    let ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0)
    // console.log(img.width, img.height)
    // 设置填充字号和字体，样式，这里设置字体大小根据canvas的宽度等比缩放，防止大图片生成的水印很小的问题
    // ctx.font = `${canvas.width * 0.05}px 宋体`
    // ctx.fillStyle = "red"
    // 设置右对齐
    // ctx.textAlign = 'right'
    // 在指定位置绘制文字
    // ctx.fillText('官方示例图', canvas.width - 100, canvas.height - 100)
    // ctx.fillText('官方示例图', canvas.width - 100, canvas.height - 50)
    const content = '官方示例图', fontSize = 80
    let height = 400; //两个水印之间的垂直高度
    let width = 210; //两个水印之间的水平高度

    ctx.textAlign = 'left';//设置文本对齐方式
    ctx.textBaseline = 'top';//设置文本基线
    ctx.font = `${fontSize}px Microsoft Yahei`;//设置文本字体属性
    ctx.fillStyle = "rgba(0, 0, 0, 0.35)"//设置文本字体颜色

    //在canvas画布上绘制文字 ctx.fillText(文字内容, x位置, y位置, 文本最大宽度)
    ctx.rotate(90 / 180)//文本旋转角度设置
    let i = 0, j = 0, waterMarkerWidth = content.split("").length * fontSize;
    for (i = 0; i < canvas.width / (waterMarkerWidth); i++) {
      // for (i = 0; i < canvas.width / (waterMarkerWidth); i++) {
      for (j = 0; j < canvas.height / (height - 70); j++) {
        if (j == 0) {
          ctx.fillText(content, i * (waterMarkerWidth + width), -height, canvas.width)
        }
        ctx.fillText(content, i * (waterMarkerWidth + width), j * height, canvas.width)
      }
    }

    // ctx.rotate(45 / 180)//文本旋转角度设置


    // 将canvas转成blob文件返回
    // canvas.toBlob(blob => resolve(blob))
    // canvas.toDataURL("image/png");
    resolve(dataURLtoFile(canvas.toDataURL("image/png"), 'image'))
  })
}

/**
* blob转img标签
*/
function blobToImg(blob) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader()
    reader.addEventListener('load', () => {
      let img = new Image()
      img.src = reader.result
      img.addEventListener('load', () => resolve(img))
    })
    reader.readAsDataURL(blob)
  })
}

function dataURLtoFile(dataurl, filename) {//将base64转换为文件
  var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  while(n--){
      u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, {type:mime});
} 