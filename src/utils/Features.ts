export const calculatedPercentage = (thisMonth:number,lastMonth:number)=>{
    if(lastMonth === 0) return thisMonth*100;
    const percentage = ((thisMonth-lastMonth)/ lastMonth) * 100;
    return Number(percentage.toFixed(0))
}