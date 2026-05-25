class SignTask
  module Reportable
    extend ActiveSupport::Concern

    class_methods do

      def summary(group_id, member_ids, time_range, zone='+0')
        sent_overall = sent_summary(group_id, member_ids, time_range)
        sent_overall.default = 0
        {
          sent_trend: sent_trend(group_id, member_ids, time_range, zone),
          completed_trend: completed_trend(group_id, member_ids, time_range, zone),
          sent: sent_overall['total'],
          waiting: sent_overall['waiting'],
          completed: SignTask.completed.where(owner_id: member_ids, group_id: group_id, completed_at: time_range).count,
          complete_rate: sent_overall['completed'].zero? ? 'N/A' : "#{(sent_overall['completed'] * 100.0 / sent_overall['total'].to_f).round(1)}%",
          cancel_rate: sent_overall['declined'].zero? ? 'N/A' : "#{(sent_overall['declined'] * 100.0 / sent_overall['total'].to_f).round(1)}%",
          spent_time_avg: sent_overall['completed'].zero? ? 'N/A' : (total_spent_time(group_id, member_ids, time_range).to_f / sent_overall['completed'] / 1.hours.to_i).round(1)
        }
      end

      def summary_by_member(group_id, member_ids, time_range)
        member_sent_overall = sent_summary_by_member(group_id, member_ids, time_range)
        member_spent_time = total_spent_time_by_member(group_id, member_ids, time_range)
        spent_time_avg_summary = {}
        member_spent_time.each_pair do |member_id, total_spent_time|
          spent_time_avg_summary[member_id] = {'spent_time_avg' => (total_spent_time.to_f / member_sent_overall[member_id]['completed'] / 1.hours.to_i).round(1)}
        end
        {
          sent_summary: member_sent_overall,
          complete_summary: complete_summary_by_member(group_id, member_ids, time_range),
          spent_time_avg_summary: spent_time_avg_summary.sort_by{|member_id, summary| summary['spent_time_avg']}.to_h
        }
      end

      def sent_trend(group_id, member_ids, time_range, zone)
        zone = "UTC+#{zone.to_i}"
        trend = SignTask.active.joins(:sign_events).where(sign_tasks: {owner_id: member_ids, group_id: group_id}).where(sign_events: {action_name: 'sent', created_at: time_range}).select(Arel.sql("date_trunc('day', sign_events.created_at at time zone '#{zone}') as date"), 'count(*)').group(Arel.sql("date_trunc('day', sign_events.created_at at time zone '#{zone}')")).order(:date)
        trend.map{|info| [info.date.strftime('%Y-%m-%d'), info.count]}.to_h
      end

      def completed_trend(group_id, member_ids, time_range, zone)
        zone = "UTC+#{zone.to_i}"
        trend = SignTask.completed.where(owner_id: member_ids, group_id: group_id, completed_at: time_range).select(Arel.sql("date_trunc('day', completed_at at time zone '#{zone}') as date"), 'count(*)').group(Arel.sql("date_trunc('day', completed_at at time zone '#{zone}')")).order(:date)
        trend.map{|info| [info.date.strftime('%Y-%m-%d'), info.count]}.to_h
      end

      def total_spent_time(group_id, member_ids, time_range)
        spent_time = SignTask.completed.joins(:sign_events).where(sign_tasks: {owner_id: member_ids, group_id: group_id}).where(sign_events: {action_name: 'sent', created_at: time_range}).select(:group_id, "sum(extract(epoch from sign_tasks.completed_at - sign_events.created_at)) as spent_time").group(:group_id)
        spent_time[0].spent_time
      end

      def sent_summary(group_id, member_ids, time_range)
        sent_count = SignTask.active.joins(:sign_events).where(sign_tasks: {owner_id: member_ids, group_id: group_id}).where(sign_events: {action_name: 'sent', created_at: time_range}).where.not(sign_tasks: {status: SignTask.statuses[:draft]}).group('sign_tasks.status').count
        sent_count['total'] = sent_count.values.sum
        sent_count
      end

      def sent_summary_by_member(group_id, member_ids, time_range)
        member_sent_count = Hash.new{|hash, key| hash[key] = Hash.new(0)}
        sent_count = SignTask.active.joins(:sign_events).where(sign_tasks: {owner_id: member_ids, group_id: group_id}).where(sign_events: {action_name: 'sent', created_at: time_range}).where.not(sign_tasks: {status: SignTask.statuses[:draft]}).group('sign_tasks.owner_id', 'sign_tasks.status').count
        sent_count.each_pair do |(member_id, status), count|
          member_sent_count[member_id][status] = count
          member_sent_count[member_id]['total'] += count
        end
        member_sent_count.sort_by{|member_id, summary| -summary['total']}.to_h
      end

      def complete_summary_by_member(group_id, member_ids, time_range)
        member_complete_count = SignTask.completed.where(owner_id: member_ids, group_id: group_id, completed_at: time_range).group(:owner_id).count
        member_complete_count.transform_values! do |count|
          {'completed' => count}
        end
        member_complete_count.sort_by{|member_id, summary| -summary['completed']}.to_h
      end

      def total_spent_time_by_member(group_id, member_ids, time_range)
        spent_time = SignTask.completed.joins(:sign_events).where(sign_tasks: {owner_id: member_ids, group_id: group_id}).where(sign_events: {action_name: 'sent', created_at: time_range}).select(:owner_id, "sum(extract(epoch from sign_tasks.completed_at - sign_events.created_at)) as spent_time").group(:owner_id)
        spent_time.map{|st| [st.owner_id, st.spent_time]}.to_h
      end

    end

  end
end
