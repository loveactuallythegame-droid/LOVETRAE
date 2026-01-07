import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '@/lib/supabaseClient';

type GameFormProps = {
  initial?: any;
  onSaved: () => void;
};

type FormData = {
  name: string;
  mechanics: string;
  category: string;
  xp_reward: number;
  marcies_script: string;
  sarcasm_level: number;
  difficulty: string;
};

export default function GameForm({ initial, onSaved }: GameFormProps) {
  const { register, handleSubmit, reset, setValue } = useForm<FormData>({
    defaultValues: {
      name: '',
      mechanics: 'Slider',
      category: 'Emotional',
      xp_reward: 10,
      marcies_script: '',
      sarcasm_level: 1,
      difficulty: 'easy',
    }
  });

  useEffect(() => {
    if (initial) {
      setValue('name', initial.name);
      setValue('mechanics', initial.mechanics);
      setValue('category', initial.category);
      setValue('xp_reward', initial.xp_reward);
      setValue('marcies_script', initial.marcies_script);
      setValue('sarcasm_level', initial.sarcasm_level);
      setValue('difficulty', initial.difficulty || 'easy');
    } else {
      reset({
        name: '',
        mechanics: 'Slider',
        category: 'Emotional',
        xp_reward: 10,
        marcies_script: '',
        sarcasm_level: 1,
        difficulty: 'easy',
      });
    }
  }, [initial, setValue, reset]);

  const onSubmit = async (data: FormData) => {
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id || '';

    const res = await fetch('/api/games/save', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-user-id': userId 
      },
      body: JSON.stringify({ ...data, id: initial?.id })
    });

    if (res.ok) {
      reset();
      onSaved();
    } else {
      alert('Failed to save game');
    }
  };

  return (
    <div className="card">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <input className="input" placeholder="Game Title" {...register('name', { required: true })} />
        </div>
        <div className="row">
          <select className="input" {...register('mechanics')}>
            {['Slider','Text','Video','AR'].map((m) => (<option key={m} value={m}>{m}</option>))}
          </select>
          <select className="input" {...register('category')}>
            {['Emotional','Conflict','Creative','Romance'].map((c) => (<option key={c} value={c}>{c}</option>))}
          </select>
          <input className="input" type="number" {...register('xp_reward', { min: 0 })} />
          <select className="input" {...register('difficulty')}>
            {['easy','medium','hard'].map((d) => (<option key={d} value={d}>{d}</option>))}
          </select>
        </div>
        <textarea className="input" rows={6} placeholder="Marcie's Intro Script" {...register('marcies_script')} />
        <div className="row">
          <label>Sarcasm</label>
          <input className="input" type="number" min={1} max={5} {...register('sarcasm_level', { min: 1, max: 5 })} />
          <button className="btn" type="submit">Save</button>
        </div>
      </form>
    </div>
  );
}
