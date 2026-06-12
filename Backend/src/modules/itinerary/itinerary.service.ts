import { ItineraryRepository } from './itinerary.repository';
import { GenerateItineraryInputDTO, ItineraryResult, ItineraryItem } from './itinerary.types';
import { DBMapPinRow } from '../maps/maps.types';

export class ItineraryService {
  private itineraryRepository = new ItineraryRepository();

  async buildFallbackItinerary(input: GenerateItineraryInputDTO): Promise<ItineraryResult> {
    
    const matchingPins = await this.itineraryRepository.getRandomPinsByCategory(input.category, 3);
    const schedule: ItineraryItem[] = [];
    const [time, period] = input.startTime.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    schedule.push({
      timeSlot: `${this.formatTime(hours, minutes)} ${period}`,
      activityTitle: `Assemble and Briefing Workspace`,
      details: `Meet up with fellow tech interns at your central hub workspace to coordinate logistics before setting out.`
    });

    let currentPinIndex = 0;
    let accumulatedHours = 1;

    while (accumulatedHours < input.durationHours) {
      hours += 2;
      if (hours > 12) hours -= 12; // Handle clock wrapping rules cleanly

      const activePin = matchingPins[currentPinIndex];

      if (activePin) {
        schedule.push({
          timeSlot: `${this.formatTime(hours, minutes)} ${period}`,
          activityTitle: `Explore: ${activePin.title}`,
          details: activePin.description,
          pin: {
            id: activePin.id,
            title: activePin.title,
            description: activePin.description,
            latitude: Number(activePin.latitude),
            longitude: Number(activePin.longitude),
            category: activePin.category,
            creatorId: activePin.creator_id,
            createdAt: activePin.created_at
          }
        });
        currentPinIndex++;
      } else {
        // Fallback buffer if the database has fewer pins stored than the duration needs
        schedule.push({
          timeSlot: `${this.formatTime(hours, minutes)} ${period}`,
          activityTitle: `Social Networking Break`,
          details: `Relax at a local rest zone and connect with other network members over casual tech talk.`
        });
      }

      accumulatedHours += 2;
    }

    return {
      title: `Automated Custom Pune ${input.category} Route Plan`,
      totalDurationHours: input.durationHours,
      schedule: schedule
    };
  }

  private formatTime(h: number, m: number): string {
    const stringH = h < 10 ? `0${h}` : `${h}`;
    const stringM = m < 10 ? `0${m}` : `${m}`;
    return `${stringH}:${stringM}`;
  }
}