import {
	DndContext,
	type DragEndEvent,
	MouseSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core'
import {
	arrayMove,
	SortableContext,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { Layers as LayersIcon, Plus as PlusIcon } from 'lucide-react'
import { LayerContext } from '../../contexts/layer-context'
import { useSafeContext } from '../../hooks'
import { Button } from './button'
import { Layer } from './layer'

export const Layers = () => {
	const { layers, addLayer, setLayers } = useSafeContext(LayerContext)
	const sensors = useSensors(
		useSensor(MouseSensor, {
			activationConstraint: {
				distance: 10,
			},
		}),
	)

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event

		if (!over || active.id === over.id) return

		setLayers((items) => {
			const oldIndex = items.findIndex((item) => item.id === active.id)
			const newIndex = items.findIndex((item) => item.id === over.id)

			return arrayMove(items, oldIndex, newIndex)
		})
	}

	return (
		<div className='border-t border-slate-200 dark:border-slate-800'>
			<div className='flex items-center justify-between my-4'>
				<h2 className='text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2'>
					<LayersIcon size={16} />
					<span>Camadas</span>
				</h2>
				<Button
					onClick={addLayer}
					className='p-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-cyan-500/25 hover:text-cyan-400 rounded-lg transition-colors'
				>
					<PlusIcon size={16} />
				</Button>
			</div>
			<DndContext sensors={sensors} onDragEnd={handleDragEnd}>
				<div className='flex flex-col gap-1'>
					<SortableContext
						items={layers.map((layer) => layer.id)}
						strategy={verticalListSortingStrategy}
					>
						{layers
							.map((layer) => (
								<Layer
									key={layer.id}
									data={layer}
									allowDelete={layers.length > 1}
								/>
							))
							.reverse()}
					</SortableContext>
				</div>
			</DndContext>
		</div>
	)
}
