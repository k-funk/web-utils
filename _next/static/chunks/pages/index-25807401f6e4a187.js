(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[405],{8312:function(a,b,c){(window.__NEXT_P=window.__NEXT_P||[]).push(["/",function(){return c(918)}])},918:function(a,b,c){"use strict";c.r(b),c.d(b,{default:function(){return B}});var d,e=c(2670),f=c(1799),g=c(9396),h=c(5893),i=c(9008),j=c.n(i),k=c(7294),l=c(6486),m=c(120),n=c(3461),o=c(6483),p=c(603),q=c(4113),r=c.n(q);function s(a){var b=a.onChangeFiles,c=a.acceptType,d=a.filename,e=function(a){a.preventDefault(),a.stopPropagation(),"dragenter"===a.type||"dragover"===a.type?m(!0):"dragleave"===a.type&&m(!1)},f=function(a){a.preventDefault(),a.stopPropagation(),m(!1),a.dataTransfer.files&&a.dataTransfer.files[0]&&b(a.dataTransfer.files)},g=function(a){a.preventDefault(),a.target.files&&a.target.files[0]&&b(a.target.files)},i=function(){var a;null===(a=n.current)|| void 0===a||a.click()},j=(0,p.Z)(k.useState(!1),2),l=j[0],m=j[1],n=k.useRef(null);return(0,h.jsxs)("form",{className:r().formFileUpload,onDragEnter:e,onSubmit:function(a){return a.preventDefault()},onClick:i,children:[(0,h.jsx)("input",{ref:n,type:"file",className:r().inputFileUpload,multiple:!0,onChange:g,accept:c}),(0,h.jsx)("label",{className:"".concat(r().labelFileUpload," ").concat(l?r().dragActive:""),htmlFor:"inputFileUpload",children:(0,h.jsxs)("div",{children:[(0,h.jsxs)("p",{children:["Drag and drop the ",c," file here, or click to browse."]}),d&&(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)("div",{className:"text-uppercase text-muted",children:(0,h.jsx)("small",{children:"filename"})}),(0,h.jsx)("p",{children:(0,h.jsx)("code",{children:d})})]})]})}),l&&(0,h.jsx)("div",{className:r().dragFileElement,onDragEnter:e,onDragLeave:e,onDragOver:e,onDrop:f})]})}var t=c(214),u=c.n(t),v=c(3836),w=c.n(v);function x(a){var b=a.children;return(0,h.jsx)("div",{className:w().alert,children:b})}var y,z=c(8869);(y=d||(d={})).dateFormat="dateFormat";var A=[{label:"Date",key:"Fecha"},{label:"Document",key:"Documento"},{label:"Description",key:"Descripci\xf3n"},{label:"Debit",key:"D\xe9bitos"},{label:"Credit",key:"Cr\xe9ditos"},],B=function(){var a=function(a){var b=o.ZP.load(a),c=b('td:contains("Fecha")').filter(function(a,c){return"Fecha"===b(c).text()}).parents("table").first();return c.find("tr").first().find("td").each(function(a,b){return b.tagName="th"}),c.toString()},b=function(b){try{var c=a(b),d=z.parse(c);if(1!==d.count)throw Error("html format changed. more than one table found");v(d.results[0])}catch(f){q((0,e.Z)(f,Error)?f.message:JSON.stringify(f))}},c=function(a){if(q(void 0),1!==a.length)throw Error("more than one file was included");var c=a[0];B(c.name);var d=new FileReader;d.onload=function(){null!=d.result&&"string"==typeof d.result&&b(d.result)},d.readAsText(c)},i=(0,k.useState)(),p=i[0],q=i[1],r=(0,k.useState)([]),t=r[0],v=r[1],w=(0,k.useState)(""),y=w[0],B=w[1],C=(0,k.useState)([d.dateFormat,]),D=C[0],E=C[1],F=(0,k.useMemo)(function(){var a=t;return D.includes(d.dateFormat)&&(a=a.map(function(a){return(0,g.Z)((0,f.Z)({},a),{Fecha:m.ou.fromFormat(a.Fecha,"d/M/yyyy").toFormat("MM/dd/yyyy")})})),a},[t,D]),G="promerica-converted-xls-".concat(m.ou.now().toFormat("MM-dd-yyyy"));return(0,h.jsxs)("div",{className:u().container,children:[(0,h.jsxs)(j(),{children:[(0,h.jsx)("title",{children:"Web Utils"}),(0,h.jsx)("meta",{name:"description",content:"Promerica '.xls' to .csv converter"}),(0,h.jsx)("link",{rel:"icon",href:"/favicon.ico"})]}),(0,h.jsxs)("main",{className:u().main,children:[(0,h.jsxs)("h1",{className:u().title,children:["Promerica ",'".xls"'," to .csv"]}),(0,h.jsxs)("p",{className:u().description,children:["Promerica CR outputs a so-called ",'".xls"'," format for bank statements. Turns out these morons just output an html file and changed the filename to ",'".xls"',". This tool parses that html and turns the main table into a csv file. Unfortunately, because of the nature of html, this tool will likely break when Promerica makes any changes to their site, since it functions like a scraper (using html selectors)."]}),(0,h.jsx)(s,{onChangeFiles:c,acceptType:".xls",filename:y}),p&&(0,h.jsx)(x,{children:p}),t.length>0&&(0,h.jsxs)("div",{className:u().twoColumn,children:[(0,h.jsx)("div",{children:(0,h.jsxs)("label",{className:u().checkboxLabel,children:[(0,h.jsx)("input",{type:"checkbox",checked:D.includes(d.dateFormat),onChange:function(a){return E((0,l.xor)(D,[d.dateFormat]))},className:u().checkboxMargin}),(0,h.jsxs)("span",{children:["d/M/yyyy ",(0,h.jsx)("span",{className:"text-muted",children:"->"})," MM/dd/yyyy"]})]})}),(0,h.jsx)("div",{children:(0,h.jsx)(n.CSVLink,{data:F,headers:A,className:u().csvLink,filename:G,target:"_blank",children:"Download .csv"})})]})]})]})}},3836:function(a){a.exports={alert:"Alert_alert__gpPLT"}},4113:function(a){a.exports={formFileUpload:"DragAndDrop_formFileUpload__oLo6x",inputFileUpload:"DragAndDrop_inputFileUpload__4nBVh",labelFileUpload:"DragAndDrop_labelFileUpload__P5MLm",dragActive:"DragAndDrop_dragActive__fitsr",uploadButton:"DragAndDrop_uploadButton___nTLz",dragFileElement:"DragAndDrop_dragFileElement__de_10"}},214:function(a){a.exports={container:"Home_container__bCOhY",main:"Home_main__nLjiQ",checkboxLabel:"Home_checkboxLabel__Bt20M",checkboxMargin:"Home_checkboxMargin__FYqqn",csvLink:"Home_csvLink__8kjvh",twoColumn:"Home_twoColumn__JrgXQ"}}},function(a){a.O(0,[662,23,774,888,179],function(){var b;return a(a.s=8312)}),_N_E=a.O()}])