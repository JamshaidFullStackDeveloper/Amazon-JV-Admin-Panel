import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import LandingPageLayout from '../Layout';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

const InvestmentCalculator = () => {
    const [currentMode, setCurrentMode] = useState('active');
    const [investment, setInvestment] = useState(5000);
    const [cycles, setCycles] = useState(1);
    const [profitPercentage, setProfitPercentage] = useState(4.0);
    const [breakdownOpen, setBreakdownOpen] = useState(false);
    const [exchangeRates, setExchangeRates] = useState({});
    const [convertAmount, setConvertAmount] = useState(1);
    const [fromCurrency, setFromCurrency] = useState('USD');
    const [toCurrency, setToCurrency] = useState('PKR');
    const [conversionResult, setConversionResult] = useState('');

    // Background animation state
    const [coins, setCoins] = useState([]);

    useEffect(() => {
        fetchExchangeRates();
        startBackgroundAnimation();
    }, []);

    const fetchExchangeRates = async () => {
        try {
            const API_KEY = 'be51ff8c6691480c91494f6d';
            const response = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`);
            const data = await response.json();
            setExchangeRates(data.conversion_rates);
        } catch (error) {
            console.error('Error fetching exchange rates:', error);
        }
    };

    const startBackgroundAnimation = () => {
        const interval = setInterval(() => {
            const type = Math.random() > 0.6 ? 'coin' : 'dollar';
            createBackgroundAnimation(type);
        }, 300);

        return () => clearInterval(interval);
    };

    const createBackgroundAnimation = (type) => {
        const newCoin = {
            id: Math.random(),
            type,
            left: `${Math.random() * 100}%`,
            size: 20 + Math.random() * 20,
            duration: 3 + Math.random() * 3,
        };

        setCoins(prev => [...prev, newCoin]);
        setTimeout(() => {
            setCoins(prev => prev.filter(coin => coin.id !== newCoin.id));
        }, newCoin.duration * 1000);
    };

    const calculateProfit = () => {
        let principal = investment;
        let totalAmount = principal;
        let totalProfit = 0;

        for (let i = 0; i < cycles; i++) {
            const cycleProfit = parseFloat((totalAmount * (profitPercentage / 100)).toFixed(4));
            totalProfit += cycleProfit;
            totalAmount += cycleProfit;
        }

        const monthCount = (cycles * 1.5).toFixed(1);
        const annualizedReturn = ((totalAmount / principal - 1) * 100 * (8 / cycles)).toFixed(2);

        return {
            totalProfit,
            totalAmount,
            monthCount,
            annualizedReturn
        };
    };

    // const handleModeChange = (mode) => {
    //     setCurrentMode(mode);
    //     if (mode === 'active') {
    //         setInvestment(5000);
    //         setProfitPercentage(4.0);
    //     } else {
    //         setInvestment(1000);
    //         setProfitPercentage(2.0);
    //     }
    // };
    // console.log(currentMode);

    // Use useCallback to prevent unnecessary re-creations of this function
    const handleModeChange = useCallback((mode) => {
        if (mode !== currentMode) {
            setCurrentMode(mode);
            setInvestment(mode === 'active' ? 5000 : 1000);
            setProfitPercentage(mode === 'active' ? 4.0 : 2.0);
        }
    }, [currentMode]);


    return (
        <div className="min-h-screen bg-white relative overflow-hidden">
            <LandingPageLayout>
                {/* Background Animations */}
                <div className="fixed inset-0 pointer-events-none">
                    {coins.map((coin) => (
                        <div
                            key={coin.id}
                            className={`absolute ${coin.type === 'coin' ? 'bg-gradient-to-br from-[#FFD700] to-[#FFA500]' : 'bg-gradient-to-r from-[#004d00] to-[#006600]'} rounded-full flex items-center justify-center text-white font-bold`}
                            style={{
                                left: coin.left,
                                width: `${coin.size}px`,
                                height: `${coin.size}px`,
                                animation: `fall ${coin.duration}s linear forwards`
                            }}
                        >
                            {coin.type === 'coin' && '$'}
                        </div>
                    ))}
                </div>

                <div className="container mx-auto px-4 py-24">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Calculator Card */}
                        <Card className="lg:col-span-2 bg-white bg-opacity-30 backdrop-blur-lg border-opacity-10 rounded-3xl">
                            <CardHeader>
                                <CardTitle className="text-white text-left">
                                    <h1 className='text-[#000] text-3xl '>Investment Calculator</h1>
                                    <p className='text-[#465267] my-2'>Calculate your potential returns with our investment calculator</p>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Inputs Section */}
                                    <div>
                                        <Tabs defaultValue={currentMode} onValueChange={handleModeChange} className="mb-6">
                                            <TabsList className="flex w-full border border-gray-300 rounded-lg bg-gray-100 p-4 h-12">
                                                <TabsTrigger
                                                    value="active"
                                                    className={cn(
                                                        "flex-1 px-4 py-2 rounded-lg text-center font-medium transition",
                                                        currentMode === "active" ? "data-[state=active]:bg-blue-600 data-[state=active]:text-white" : "bg-gray-100 text-gray-700"
                                                    )}
                                                >
                                                    Active
                                                </TabsTrigger>
                                                <TabsTrigger
                                                    value="inactive"
                                                    className={cn(
                                                        "flex-1 px-4 py-2 rounded-lg text-center font-medium transition",
                                                        currentMode === "inactive" ? "data-[state=active]:bg-blue-600 data-[state=active]:text-white" : "bg-gray-100 text-gray-700"
                                                    )}
                                                >
                                                    Inactive
                                                </TabsTrigger>
                                            </TabsList>
                                        </Tabs>

                                        <div className="space-y-6">
                                            <div>
                                                <label className="text-[#84969E] mb-2 block">Investment Amount ($)</label>
                                                <Input
                                                    type="number"
                                                    value={investment}
                                                    onChange={(e) => setInvestment(Number(e.target.value))}
                                                    className="bg-opacity-5 border-opacity-10 text-black "
                                                />
                                            </div>

                                            <div>
                                                <label className="text-[#84969E] mb-2 block">Cycles</label>
                                                <Input
                                                    type="number"
                                                    value={cycles}
                                                    onChange={(e) => setCycles(Number(e.target.value))}
                                                    min={1}
                                                    max={24}
                                                    className="bg-opacity-5 border-opacity-10 text-black "
                                                />
                                                <span className="text-[#84969E] text-opacity-50 text-sm">1 cycle = 45 days</span>
                                            </div>

                                            <div>
                                                <label className="text-[#84969E] mb-2 block">Profit Percentage ( {currentMode === 'active' ? '4.0%' : '2.0%'}- {currentMode === 'inactive' ? '4.0%' : '2.0%'})</label>
                                                <Slider
                                                    value={[profitPercentage * 10]}
                                                    min={currentMode === 'active' ? 40 : 20}
                                                    max={currentMode === 'active' ? 60 : 40}
                                                    step={1}
                                                    onValueChange={(value) => setProfitPercentage(value[0] / 10)}
                                                    className="my-4 "
                                                />
                                                <div className="flex justify-between text-[#84969E] text-opacity-50">
                                                    <span>{currentMode === 'active' ? '4.0%' : '2.0%'}</span>
                                                    <span>{currentMode === 'active' ? '6.0%' : '4.0%'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Results Section */}
                                    <div className="bg-white bg-opacity-5 rounded-xl p-6">
                                        <h3 className="text-[#000] text-xl font-bold mb-4">Total Profit</h3>
                                        <div className="text-[#0071E4] text-4xl font-bold mb-4">
                                            ${calculateProfit().totalProfit.toFixed(2)}
                                        </div>
                                        <div className="text-[#94A3B8] text-opacity-80">
                                            {cycles} cycles =  <span className='text-black'>{calculateProfit().monthCount} months </span>
                                        </div>
                                        <div className="text-[#94A3B8] text-opacity-80 mt-2">
                                            Annual ROI: {calculateProfit().annualizedReturn}%
                                        </div>
                                        <Dialog open={breakdownOpen} onOpenChange={setBreakdownOpen}>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" className="mt-4 w-full">
                                                    View Investment Details
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Investment Breakdown</DialogTitle>
                                                </DialogHeader>
                                                {/* Add breakdown content here */}
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Currency Converter Card */}
                        <Card className="bg-white bg-opacity-30 backdrop-blur-lg border-opacity-10 rounded-3xl">
                            <CardHeader>
                                <CardTitle className="text-[#000] text-left text-3xl">
                                    Currency Converter
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-[#84969E] mb-2 block">Amount</label>
                                        <Input
                                            type="number"
                                            value={convertAmount}
                                            onChange={(e) => setConvertAmount(Number(e.target.value))}
                                            className="bg-opacity-5 border-opacity-10 text-[#000]"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[#84969E] mb-2 block">From</label>
                                        <Select value={fromCurrency} onValueChange={setFromCurrency}>
                                            <SelectTrigger className="text-[#000]">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white text-[#000]">
                                                {Object.keys(exchangeRates).map(currency => (
                                                    <SelectItem key={currency} value={currency}>
                                                        {currency}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <label className="text-[#84969E] mb-2 block">To</label>
                                        <Select value={toCurrency} onValueChange={setToCurrency}>
                                            <SelectTrigger className="text-[#000]">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white text-[#000]">
                                                {Object.keys(exchangeRates).map(currency => (
                                                    <SelectItem key={currency} value={currency}>
                                                        {currency}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <Button
                                        className="w-full bg-[#0058EA] hover:bg-[#005eea]"
                                        onClick={() => {
                                            const result = convertAmount * (exchangeRates[toCurrency] / exchangeRates[fromCurrency]);
                                            setConversionResult(`${convertAmount} ${fromCurrency} = ${result.toFixed(2)} ${toCurrency}`);
                                        }}
                                    >
                                        Convert Currency
                                    </Button>

                                    {conversionResult && (
                                        <div className="text-[#FFB800] text-lg text-center mt-4">
                                            {conversionResult}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <style jsx global>{`
        @keyframes fall {
          0% {
            transform: translateY(-100px) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(calc(100vh + 100px)) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
            </LandingPageLayout>
        </div>
    );
};

export default InvestmentCalculator;