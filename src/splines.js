let Brevier = require('./brevier.js');

let Splines = function(){
  this.points = [];
}

Splines.prototype = {
  draw: function(context){
    for (let i in this.points){
      let point = this.points[i];
      context.fillRect(point[0] - 5,point[1] - 5,10,10);
    }
  },
  addPoint: function(x,y){
    this.points.push([x, y]);
    this.points = this.points.sort(function(a, b) { return a[0] > b[0];  });
  },
  generateBreviers: function(){
    if (this.points.length < 2) return [];
    let breviers = [];

    let x = this.points.map(function(a) { return a[0]; });
    let y = this.points.map(function(a) { return a[1]; });
    let px = this.computeControlPoints(x);
    let py = this.computeControlPoints(y);

    for (let i = 0; i < this.points.length - 1; i += 1){
      let brevier = new Brevier();
      brevier.addPoint(x[i], y[i]);
      brevier.addPoint(px.p1[i], py.p1[i]);
      brevier.addPoint(px.p2[i], py.p2[i]);
      brevier.addPoint(x[i + 1], y[i + 1]);
      
      breviers.push(brevier);
    }
    return breviers;
  },
  computeControlPoints: function(K){ //from https://www.particleincell.com/2012/bezier-splines/
    p1=new Array();
    p2=new Array();
    n = K.length-1;
    
    /*rhs vector*/
    a=new Array();
    b=new Array();
    c=new Array();
    r=new Array();
    
    /*left most segment*/
    a[0]=0;
    b[0]=2;
    c[0]=1;
    r[0] = K[0]+2*K[1];
    
    /*internal segments*/
    for (i = 1; i < n - 1; i++)
    {
      a[i]=1;
      b[i]=4;
      c[i]=1;
      r[i] = 4 * K[i] + 2 * K[i+1];
    }
        
    /*right segment*/
    a[n-1]=2;
    b[n-1]=7;
    c[n-1]=0;
    r[n-1] = 8*K[n-1]+K[n];
    
    /*solves Ax=b with the Thomas algorithm (from Wikipedia)*/
    for (i = 1; i < n; i++)
    {
      m = a[i]/b[i-1];
      b[i] = b[i] - m * c[i - 1];
      r[i] = r[i] - m*r[i-1];
    }
   
    p1[n-1] = r[n-1]/b[n-1];
    for (i = n - 2; i >= 0; --i)
      p1[i] = (r[i] - c[i] * p1[i+1]) / b[i];
      
    /*we have p1, now compute p2*/
    for (i=0;i<n-1;i++)
      p2[i]=2*K[i+1]-p1[i+1];
    
    p2[n-1]=0.5*(K[n]+p1[n-1]);
    
    return {p1:p1, p2:p2};
  }
}


module.exports = Splines;
