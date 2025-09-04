import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Coins, 
  Trophy, 
  Target, 
  TrendingUp, 
  Wallet, 
  Users,
  Star,
  Zap
} from 'lucide-react';
import { useStellarServices } from '@/hooks/use-stellar-services';
import { KaleTask } from '@/lib/kale';

export const KaleRewards = () => {
  const { 
    stakingData, 
    availableTasks, 
    userStats, 
    leaderboard,
    getUserStakingData,
    stakeTokens,
    unstakeTokens,
    harvestRewards,
    completeTask,
    getUserStats,
    getLeaderboard,
    isLoading, 
    error,
    clearError,
    isConnected
  } = useStellarServices();

  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');

  useEffect(() => {
    // Cargar datos del usuario si hay wallet conectada
    if (isConnected) {
      getUserStakingData();
      getUserStats();
      getLeaderboard();
    }
  }, [isConnected, getUserStakingData, getUserStats, getLeaderboard]);

  const handleStake = async () => {
    const amount = parseFloat(stakeAmount);
    if (amount > 0) {
      await stakeTokens(amount);
      setStakeAmount('');
    }
  };

  const handleUnstake = async () => {
    const amount = parseFloat(unstakeAmount);
    if (amount > 0) {
      await unstakeTokens(amount);
      setUnstakeAmount('');
    }
  };

  const handleHarvest = async () => {
    await harvestRewards();
  };

  const handleCompleteTask = async (taskId: string) => {
    await completeTask(taskId);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRankColor = (rank: string) => {
    switch (rank) {
      case 'Bronze': return 'text-amber-600';
      case 'Silver': return 'text-gray-500';
      case 'Gold': return 'text-yellow-500';
      case 'Platinum': return 'text-blue-500';
      case 'Diamond': return 'text-purple-500';
      default: return 'text-gray-600';
    }
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          {error}
          <Button variant="outline" size="sm" onClick={clearError} className="ml-2">
            Dismiss
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header de KALE */}
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          KALE Rewards
        </h2>
        <p className="text-muted-foreground mt-2">
          Sistema de recompensas basado en trabajo en equipo y participación
        </p>
      </div>

      {!isConnected && (
        <Alert>
          <AlertDescription>
            Conecta tu wallet de Stellar para acceder al sistema de recompensas KALE.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="staking" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="staking" className="flex items-center space-x-2">
            <Wallet className="w-4 h-4" />
            <span>Staking</span>
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex items-center space-x-2">
            <Target className="w-4 h-4" />
            <span>Tareas</span>
          </TabsTrigger>
          <TabsTrigger value="rewards" className="flex items-center space-x-2">
            <Trophy className="w-4 h-4" />
            <span>Recompensas</span>
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Ranking</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab de Staking */}
        <TabsContent value="staking" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Información de Staking */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Coins className="w-5 h-5" />
                  <span>Mi Staking</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {stakingData ? (
                  <>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tokens Staked:</span>
                        <span className="font-bold">{stakingData.stakedAmount.toLocaleString()} KALE</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">APY:</span>
                        <span className="font-bold text-green-600">{(stakingData.rewardRate * 100).toFixed(2)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Harvested:</span>
                        <span className="font-bold">{stakingData.totalHarvested.toLocaleString()} KALE</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Duración:</span>
                        <span className="font-bold">{stakingData.stakingDuration} días</span>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                                              <Button 
                          onClick={handleHarvest} 
                          disabled={isLoading}
                          className="w-full"
                          variant="outline"
                        >
                          <Coins className="w-4 h-4 mr-2" />
                          Harvest Recompensas
                        </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    No hay datos de staking disponibles
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Acciones de Staking */}
            <Card>
              <CardHeader>
                <CardTitle>Acciones de Staking</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Stake */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Stake KALE</label>
                  <div className="flex space-x-2">
                    <Input
                      type="number"
                      placeholder="Cantidad"
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(e.target.value)}
                    />
                    <Button onClick={handleStake} disabled={isLoading || !stakeAmount}>
                      Stake
                    </Button>
                  </div>
                </div>

                {/* Unstake */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Unstake KALE</label>
                  <div className="flex space-x-2">
                    <Input
                      type="number"
                      placeholder="Cantidad"
                      value={unstakeAmount}
                      onChange={(e) => setUnstakeAmount(e.target.value)}
                    />
                    <Button onClick={handleUnstake} disabled={isLoading || !unstakeAmount}>
                      Unstake
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab de Tareas */}
        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5" />
                <span>Tareas Disponibles</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableTasks.map((task) => (
                  <Card key={task.id} className="relative">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{task.name}</CardTitle>
                        <Badge className={getDifficultyColor(task.difficulty)}>
                          {task.difficulty}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Coins className="w-4 h-4 text-yellow-600" />
                          <span className="font-medium">{task.reward} KALE</span>
                        </div>
                        <Button
                          onClick={() => handleCompleteTask(task.id)}
                          disabled={isLoading || task.isCompleted}
                          size="sm"
                          variant={task.isCompleted ? "secondary" : "default"}
                        >
                          {task.isCompleted ? "Completada" : "Completar"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab de Recompensas */}
        <TabsContent value="rewards" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Estadísticas del Usuario */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Mis Estadísticas</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userStats ? (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Staked:</span>
                        <span className="font-bold">{userStats.totalStaked.toLocaleString()} KALE</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Recompensas:</span>
                        <span className="font-bold text-green-600">{userStats.totalRewards.toLocaleString()} KALE</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tareas Completadas:</span>
                        <span className="font-bold">{userStats.tasksCompleted}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Rango:</span>
                        <span className={`font-bold ${getRankColor(userStats.rank)}`}>
                          {userStats.rank}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Nivel:</span>
                        <span className="font-bold">{userStats.level}</span>
                      </div>
                    </div>
                    
                    {/* Barra de progreso del nivel */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progreso al siguiente nivel</span>
                        <span>75%</span>
                      </div>
                      <Progress value={75} className="w-full" />
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    No hay estadísticas disponibles
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Información de KALE */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-5 h-5" />
                  <span>Acerca de KALE</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground space-y-3">
                  <p>
                    KALE es un token de prueba de trabajo en equipo donde los participantes 
                    hacen stake, completan tareas y cosechan recompensas.
                  </p>
                  <p>
                    <strong>Características:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>No es winner-takes-all</li>
                    <li>Recompensas basadas en contribuciones</li>
                    <li>Mineros disponibles para todos</li>
                    <li>Participación desde cualquier dispositivo</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab de Leaderboard */}
        <TabsContent value="leaderboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="w-5 h-5" />
                <span>Leaderboard</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaderboard.map((user, index) => (
                  <div key={user.rank} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
                        {user.rank}
                      </div>
                      <div>
                        <div className="font-medium">{user.userAddress}</div>
                        <div className="text-sm text-muted-foreground">
                          Staked: {user.totalStaked.toLocaleString()} KALE
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">
                        {user.totalRewards.toLocaleString()} KALE
                      </div>
                      <div className="text-sm text-muted-foreground">Recompensas</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
